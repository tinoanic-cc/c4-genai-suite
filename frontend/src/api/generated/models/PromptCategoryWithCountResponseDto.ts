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
/**
 * 
 * @export
 * @interface PromptCategoryWithCountResponseDto
 */
export interface PromptCategoryWithCountResponseDto {
    /**
     * Unique identifier of the category
     * @type {number}
     * @memberof PromptCategoryWithCountResponseDto
     */
    id: number;
    /**
     * Name of the category
     * @type {string}
     * @memberof PromptCategoryWithCountResponseDto
     */
    name: string;
    /**
     * Description of the category
     * @type {string}
     * @memberof PromptCategoryWithCountResponseDto
     */
    description?: string;
    /**
     * Color code for UI
     * @type {string}
     * @memberof PromptCategoryWithCountResponseDto
     */
    color?: string;
    /**
     * Sort order
     * @type {number}
     * @memberof PromptCategoryWithCountResponseDto
     */
    sortOrder: number;
    /**
     * Creation date
     * @type {Date}
     * @memberof PromptCategoryWithCountResponseDto
     */
    createdAt: Date;
    /**
     * Last update date
     * @type {Date}
     * @memberof PromptCategoryWithCountResponseDto
     */
    updatedAt: Date;
    /**
     * Number of prompts in this category
     * @type {number}
     * @memberof PromptCategoryWithCountResponseDto
     */
    promptCount: number;
}

/**
 * Check if a given object implements the PromptCategoryWithCountResponseDto interface.
 */
export function instanceOfPromptCategoryWithCountResponseDto(value: object): value is PromptCategoryWithCountResponseDto {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('sortOrder' in value) || value['sortOrder'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('promptCount' in value) || value['promptCount'] === undefined) return false;
    return true;
}

export function PromptCategoryWithCountResponseDtoFromJSON(json: any): PromptCategoryWithCountResponseDto {
    return PromptCategoryWithCountResponseDtoFromJSONTyped(json, false);
}

export function PromptCategoryWithCountResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PromptCategoryWithCountResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'color': json['color'] == null ? undefined : json['color'],
        'sortOrder': json['sortOrder'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
        'promptCount': json['promptCount'],
    };
}

export function PromptCategoryWithCountResponseDtoToJSON(value?: PromptCategoryWithCountResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'name': value['name'],
        'description': value['description'],
        'color': value['color'],
        'sortOrder': value['sortOrder'],
        'createdAt': ((value['createdAt']).toISOString()),
        'updatedAt': ((value['updatedAt']).toISOString()),
        'promptCount': value['promptCount'],
    };
}

