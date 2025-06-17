import * as fs from 'fs';
import * as path from 'path';
import { Logger, Module, Type } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/domain/auth/module';
import { BucketEntity, CacheEntity, FileEntity } from 'src/domain/database';
import { Extension } from 'src/domain/extensions';

const extensionBaseDir = __dirname;
const extensionClassSuffix = 'Extension';
const extensionFileSuffix = '.js';
const foldersToIgnore = new Set(['internal', 'generated']);

function getLibraryVersion(path: string) {
  const versionPath = `${path}/library.version`;
  if (fs.existsSync(versionPath)) {
    return fs.readFileSync(versionPath).toString('utf-8');
  }

  return null;
}

function getExtensionModulePaths(directory = extensionBaseDir): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const extensionFiles = [] as string[];
  entries.forEach((entry) => {
    const entryFullPath = path.join(directory, entry.name);
    if (entry.isFile() && entry.name.endsWith(extensionFileSuffix)) {
      const relativeModulePath = path.relative(extensionBaseDir, entryFullPath);
      extensionFiles.push(path.join('..', 'extensions', relativeModulePath));
    } else if (entry.isDirectory() && !foldersToIgnore.has(entry.name)) {
      extensionFiles.push(...getExtensionModulePaths(entryFullPath));
    }
  });

  return extensionFiles;
}

function getExternalExtensionModules(logger: Logger) {
  const backendLibaryVersion = getLibraryVersion('.');
  const extensionModulePrefix = '@c4/extensions';
  const extensionFolder = `node_modules/${extensionModulePrefix}`;
  const externalExtensions = [] as string[];
  if (fs.existsSync(extensionFolder)) {
    const entries = fs.readdirSync(extensionFolder, { withFileTypes: true });
    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        const extensionLibraryVersion = getLibraryVersion(`${extensionFolder}/${entry.name}`);
        if (backendLibaryVersion === extensionLibraryVersion) {
          externalExtensions.push(`${extensionModulePrefix}/${entry.name}`);
          copyDirFiles(path.join(extensionFolder, entry.name, 'i18n'), path.join(__dirname, '..', 'localization', 'i18n'));
        } else {
          logger.warn(
            `Error loading extension: version mismatch between backend (@c4/library): ${backendLibaryVersion} and ${entry.name}: ${extensionLibraryVersion}`,
          );
        }
      }
    });
  }

  return externalExtensions;
}

function copyDirFiles(source: string, target: string) {
  if (!fs.existsSync(source)) {
    return;
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });
  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      copyDirFiles(path.join(source, entry.name), path.join(target, entry.name));
    } else {
      fs.cpSync(path.join(source, entry.name), path.join(target, entry.name));
    }
  });
}

async function getExtensionProviders(logger: Logger): Promise<Type<Extension>[]> {
  const providers: Type<Extension>[] = [];

  const extensionModules = getExtensionModulePaths();
  extensionModules.push(...getExternalExtensionModules(logger));

  for (const extensionModule of extensionModules) {
    try {
      const module = (await import(extensionModule)) as Record<string, Type<Extension>>;
      const extensionKey = Object.keys(module).find((x) => x.endsWith(extensionClassSuffix));
      if (extensionKey) {
        const extension = module[extensionKey];
        providers.push(extension);
        logger.log(`Loaded extension: ${extensionKey}`);
      }
    } catch (err) {
      logger.error(`Error loading extension ${extensionModule}`, err);
    }
  }

  return providers;
}

@Module({})
export class ExtensionLibraryModule {
  static async register(): Promise<DynamicModule> {
    const providers = await getExtensionProviders(new Logger(ExtensionLibraryModule.name));
    return {
      module: ExtensionLibraryModule,
      imports: [ConfigModule, AuthModule, CqrsModule, TypeOrmModule.forFeature([CacheEntity, BucketEntity, FileEntity])],
      providers,
    };
  }
}
