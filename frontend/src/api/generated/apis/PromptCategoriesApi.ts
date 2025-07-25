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


import * as runtime from '../runtime';

export interface TaskCategoriesControllerCreateRequest {
    body: object;
}

export interface TaskCategoriesControllerDeleteRequest {
    id: number;
}

export interface TaskCategoriesControllerFindOneRequest {
    id: number;
}

export interface TaskCategoriesControllerUpdateRequest {
    id: number;
}

/**
 * 
 */
export class PromptCategoriesApi extends runtime.BaseAPI {

    /**
     * Create a new prompt category
     */
    async taskCategoriesControllerCreateRaw(requestParameters: TaskCategoriesControllerCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['body'] == null) {
            throw new runtime.RequiredError(
                'body',
                'Required parameter "body" was null or undefined when calling taskCategoriesControllerCreate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/prompt-categories`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new prompt category
     */
    async taskCategoriesControllerCreate(body: object, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerCreateRaw({ body: body }, initOverrides);
    }

    /**
     * Delete category
     */
    async taskCategoriesControllerDeleteRaw(requestParameters: TaskCategoriesControllerDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling taskCategoriesControllerDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/prompt-categories/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete category
     */
    async taskCategoriesControllerDelete(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerDeleteRaw({ id: id }, initOverrides);
    }

    /**
     * Get all prompt categories
     */
    async taskCategoriesControllerFindAllRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/prompt-categories`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get all prompt categories
     */
    async taskCategoriesControllerFindAll(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerFindAllRaw(initOverrides);
    }

    /**
     * Get all categories with prompt counts
     */
    async taskCategoriesControllerFindAllWithCountsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/prompt-categories/with-counts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get all categories with prompt counts
     */
    async taskCategoriesControllerFindAllWithCounts(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerFindAllWithCountsRaw(initOverrides);
    }

    /**
     * Get category by ID
     */
    async taskCategoriesControllerFindOneRaw(requestParameters: TaskCategoriesControllerFindOneRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling taskCategoriesControllerFindOne().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/prompt-categories/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get category by ID
     */
    async taskCategoriesControllerFindOne(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerFindOneRaw({ id: id }, initOverrides);
    }

    /**
     * Update category
     */
    async taskCategoriesControllerUpdateRaw(requestParameters: TaskCategoriesControllerUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling taskCategoriesControllerUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/prompt-categories/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update category
     */
    async taskCategoriesControllerUpdate(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.taskCategoriesControllerUpdateRaw({ id: id }, initOverrides);
    }

}
