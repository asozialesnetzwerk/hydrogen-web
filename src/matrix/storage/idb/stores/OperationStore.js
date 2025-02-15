/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function encodeTypeScopeKey(type, scope) {
    return `${type}|${scope}`;
}

export class OperationStore {
    constructor(store) {
        this._store = store;
    }

    getAll() {
        return this._store.selectAll();
    }

    async getAllByTypeAndScope(type, scope) {
        const key = encodeTypeScopeKey(type, scope);
        const results = [];
        await this._store.index("byTypeAndScope").iterateWhile(key, value => {
            if (value.typeScopeKey !== key) {
                return false;
            }
            results.push(value);
            return true;
        });
        return results;
    }

    add(operation) {
        operation.typeScopeKey = encodeTypeScopeKey(operation.type, operation.scope);
        this._store.add(operation);
    }

    update(operation) {
        this._store.put(operation);
    }

    remove(id) {
        this._store.delete(id);
    }
}
