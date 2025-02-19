type Listener<T> = (value: T) => void;
type Updater<T> = (oldValue: T) => T;

export class Storage {
    private static instance: Storage;
    private state: Map<string, any> = new Map();
    private listeners: Map<string, Listener<any>[]> = new Map();

    private constructor() {}

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    public set<T>(key: string, valueOrUpdater: T | Updater<T>, persist: boolean = false): void {
        const oldValue: T = this.get<T>(key, [] as unknown as T);
    
        const newValue: T = typeof valueOrUpdater === "function"
            ? (valueOrUpdater as Updater<T>)(oldValue)
            : valueOrUpdater;
    
        this.state.set(key, newValue);
        if (persist) {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
        this.notifyListeners(key, newValue);
    }

    public get<T>(key: string, defaultValue: T = {} as T): T {
        if (this.state.has(key)) {
            return this.state.get(key);
        }
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            try {
                const parsedValue = JSON.parse(storedValue) as T;
                this.state.set(key, parsedValue);
                return parsedValue;
            } catch (error) {
                console.error(`Erreur de parsing JSON pour "${key}" :`, error);
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public remove(key: string): void {
        this.state.delete(key);
        localStorage.removeItem(key);
        this.notifyListeners(key, undefined);
    }

    public on<T>(key: string, callback: Listener<T>): void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key)?.push(callback);
    }

    private notifyListeners<T>(key: string, value: T): void {
        if (this.listeners.has(key)) {
            this.listeners.get(key)?.forEach(callback => callback(value));
        }
    }
}
