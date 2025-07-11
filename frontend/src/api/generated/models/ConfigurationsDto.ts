//@ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * c4 GenAI Suite
 * c4 GenAI Suite
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ConfigurationDto } from './ConfigurationDto';
import {
    ConfigurationDtoFromJSON,
    ConfigurationDtoFromJSONTyped,
    ConfigurationDtoToJSON,
} from './ConfigurationDto';

/**
 * 
 * @export
 * @interface ConfigurationsDto
 */
export interface ConfigurationsDto {
    /**
     * The defined configurations.
     * @type {Array<ConfigurationDto>}
     * @memberof ConfigurationsDto
     */
    items: Array<ConfigurationDto>;
}

/**
 * Check if a given object implements the ConfigurationsDto interface.
 */
export function instanceOfConfigurationsDto(value: object): value is ConfigurationsDto {
    if (!('items' in value) || value['items'] === undefined) return false;
    return true;
}

export function ConfigurationsDtoFromJSON(json: any): ConfigurationsDto {
    return ConfigurationsDtoFromJSONTyped(json, false);
}

export function ConfigurationsDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigurationsDto {
    if (json == null) {
        return json;
    }
    return {
        
        'items': ((json['items'] as Array<any>).map(ConfigurationDtoFromJSON)),
    };
}

export function ConfigurationsDtoToJSON(value?: ConfigurationsDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'items': ((value['items'] as Array<any>).map(ConfigurationDtoToJSON)),
    };
}

