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
import type { StreamMetadataDto } from './StreamMetadataDto';
import {
    StreamMetadataDtoFromJSON,
    StreamMetadataDtoFromJSONTyped,
    StreamMetadataDtoToJSON,
} from './StreamMetadataDto';

/**
 * 
 * @export
 * @interface StreamCompletedEventDto
 */
export interface StreamCompletedEventDto {
    /**
     * The metadata about the request.
     * @type {StreamMetadataDto}
     * @memberof StreamCompletedEventDto
     */
    metadata: StreamMetadataDto;
    /**
     * 
     * @type {string}
     * @memberof StreamCompletedEventDto
     */
    type: StreamCompletedEventDtoTypeEnum;
}


/**
 * @export
 */
export const StreamCompletedEventDtoTypeEnum = {
    Completed: 'completed'
} as const;
export type StreamCompletedEventDtoTypeEnum = typeof StreamCompletedEventDtoTypeEnum[keyof typeof StreamCompletedEventDtoTypeEnum];


/**
 * Check if a given object implements the StreamCompletedEventDto interface.
 */
export function instanceOfStreamCompletedEventDto(value: object): value is StreamCompletedEventDto {
    if (!('metadata' in value) || value['metadata'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    return true;
}

export function StreamCompletedEventDtoFromJSON(json: any): StreamCompletedEventDto {
    return StreamCompletedEventDtoFromJSONTyped(json, false);
}

export function StreamCompletedEventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): StreamCompletedEventDto {
    if (json == null) {
        return json;
    }
    return {
        
        'metadata': StreamMetadataDtoFromJSON(json['metadata']),
        'type': json['type'],
    };
}

export function StreamCompletedEventDtoToJSON(value?: StreamCompletedEventDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'metadata': StreamMetadataDtoToJSON(value['metadata']),
        'type': value['type'],
    };
}

