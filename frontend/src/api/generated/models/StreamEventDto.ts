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

import type { StreamCompletedEventDto } from './StreamCompletedEventDto';
import {
    instanceOfStreamCompletedEventDto,
    StreamCompletedEventDtoFromJSON,
    StreamCompletedEventDtoFromJSONTyped,
    StreamCompletedEventDtoToJSON,
} from './StreamCompletedEventDto';
import type { StreamDebugEvent } from './StreamDebugEvent';
import {
    instanceOfStreamDebugEvent,
    StreamDebugEventFromJSON,
    StreamDebugEventFromJSONTyped,
    StreamDebugEventToJSON,
} from './StreamDebugEvent';
import type { StreamErrorEventDto } from './StreamErrorEventDto';
import {
    instanceOfStreamErrorEventDto,
    StreamErrorEventDtoFromJSON,
    StreamErrorEventDtoFromJSONTyped,
    StreamErrorEventDtoToJSON,
} from './StreamErrorEventDto';
import type { StreamLoggingEvent } from './StreamLoggingEvent';
import {
    instanceOfStreamLoggingEvent,
    StreamLoggingEventFromJSON,
    StreamLoggingEventFromJSONTyped,
    StreamLoggingEventToJSON,
} from './StreamLoggingEvent';
import type { StreamMessageSavedDto } from './StreamMessageSavedDto';
import {
    instanceOfStreamMessageSavedDto,
    StreamMessageSavedDtoFromJSON,
    StreamMessageSavedDtoFromJSONTyped,
    StreamMessageSavedDtoToJSON,
} from './StreamMessageSavedDto';
import type { StreamSourcesEvent } from './StreamSourcesEvent';
import {
    instanceOfStreamSourcesEvent,
    StreamSourcesEventFromJSON,
    StreamSourcesEventFromJSONTyped,
    StreamSourcesEventToJSON,
} from './StreamSourcesEvent';
import type { StreamSummaryDto } from './StreamSummaryDto';
import {
    instanceOfStreamSummaryDto,
    StreamSummaryDtoFromJSON,
    StreamSummaryDtoFromJSONTyped,
    StreamSummaryDtoToJSON,
} from './StreamSummaryDto';
import type { StreamTokenEventDto } from './StreamTokenEventDto';
import {
    instanceOfStreamTokenEventDto,
    StreamTokenEventDtoFromJSON,
    StreamTokenEventDtoFromJSONTyped,
    StreamTokenEventDtoToJSON,
} from './StreamTokenEventDto';
import type { StreamToolEndEventDto } from './StreamToolEndEventDto';
import {
    instanceOfStreamToolEndEventDto,
    StreamToolEndEventDtoFromJSON,
    StreamToolEndEventDtoFromJSONTyped,
    StreamToolEndEventDtoToJSON,
} from './StreamToolEndEventDto';
import type { StreamToolStartEventDto } from './StreamToolStartEventDto';
import {
    instanceOfStreamToolStartEventDto,
    StreamToolStartEventDtoFromJSON,
    StreamToolStartEventDtoFromJSONTyped,
    StreamToolStartEventDtoToJSON,
} from './StreamToolStartEventDto';
import type { StreamUIEventDto } from './StreamUIEventDto';
import {
    instanceOfStreamUIEventDto,
    StreamUIEventDtoFromJSON,
    StreamUIEventDtoFromJSONTyped,
    StreamUIEventDtoToJSON,
} from './StreamUIEventDto';

/**
 * @type StreamEventDto
 * 
 * @export
 */
export type StreamEventDto = { type: 'chunk' } & StreamTokenEventDto | { type: 'completed' } & StreamCompletedEventDto | { type: 'debug' } & StreamDebugEvent | { type: 'error' } & StreamErrorEventDto | { type: 'logging' } & StreamLoggingEvent | { type: 'saved' } & StreamMessageSavedDto | { type: 'sources' } & StreamSourcesEvent | { type: 'summary' } & StreamSummaryDto | { type: 'tool_end' } & StreamToolEndEventDto | { type: 'tool_start' } & StreamToolStartEventDto | { type: 'ui' } & StreamUIEventDto;

export function StreamEventDtoFromJSON(json: any): StreamEventDto {
    return StreamEventDtoFromJSONTyped(json, false);
}

export function StreamEventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): StreamEventDto {
    if (json == null) {
        return json;
    }
    switch (json['type']) {
        case 'chunk':
            return Object.assign({}, StreamTokenEventDtoFromJSONTyped(json, true), { type: 'chunk' } as const);
        case 'completed':
            return Object.assign({}, StreamCompletedEventDtoFromJSONTyped(json, true), { type: 'completed' } as const);
        case 'debug':
            return Object.assign({}, StreamDebugEventFromJSONTyped(json, true), { type: 'debug' } as const);
        case 'error':
            return Object.assign({}, StreamErrorEventDtoFromJSONTyped(json, true), { type: 'error' } as const);
        case 'logging':
            return Object.assign({}, StreamLoggingEventFromJSONTyped(json, true), { type: 'logging' } as const);
        case 'saved':
            return Object.assign({}, StreamMessageSavedDtoFromJSONTyped(json, true), { type: 'saved' } as const);
        case 'sources':
            return Object.assign({}, StreamSourcesEventFromJSONTyped(json, true), { type: 'sources' } as const);
        case 'summary':
            return Object.assign({}, StreamSummaryDtoFromJSONTyped(json, true), { type: 'summary' } as const);
        case 'tool_end':
            return Object.assign({}, StreamToolEndEventDtoFromJSONTyped(json, true), { type: 'tool_end' } as const);
        case 'tool_start':
            return Object.assign({}, StreamToolStartEventDtoFromJSONTyped(json, true), { type: 'tool_start' } as const);
        case 'ui':
            return Object.assign({}, StreamUIEventDtoFromJSONTyped(json, true), { type: 'ui' } as const);
        default:
            throw new Error(`No variant of StreamEventDto exists with 'type=${json['type']}'`);
    }
}

export function StreamEventDtoToJSON(value?: StreamEventDto | null): any {
    if (value == null) {
        return value;
    }
    switch (value['type']) {
        case 'chunk':
            return StreamTokenEventDtoToJSON(value);
        case 'completed':
            return StreamCompletedEventDtoToJSON(value);
        case 'debug':
            return StreamDebugEventToJSON(value);
        case 'error':
            return StreamErrorEventDtoToJSON(value);
        case 'logging':
            return StreamLoggingEventToJSON(value);
        case 'saved':
            return StreamMessageSavedDtoToJSON(value);
        case 'sources':
            return StreamSourcesEventToJSON(value);
        case 'summary':
            return StreamSummaryDtoToJSON(value);
        case 'tool_end':
            return StreamToolEndEventDtoToJSON(value);
        case 'tool_start':
            return StreamToolStartEventDtoToJSON(value);
        case 'ui':
            return StreamUIEventDtoToJSON(value);
        default:
            throw new Error(`No variant of StreamEventDto exists with 'type=${value['type']}'`);
    }

}

