import { ApplicationContext } from '../../src';
import { PartialInstAwareProcessor } from '../../src/types/InstantiationAwareProcessor';
import { Newable } from '../../src/types/Newable';

describe('InstantiationAwareProcessor', () => {
    describe('beforeInstantiation', () => {
        it('should the beforeInstantiation method be called before creating an instance', () => {
            class Service {
                hello() {
                    console.log('hello');
                }
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn();
                    }
                }
            );
            const service = app.getInstance(Service);
            service.hello();
            expect(fn).toBeCalled();
        });

        // eslint-disable-next-line max-len
        it('should the instance obtained by ApplicationContext be replaced by the instance returned by beforeInstantiation', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const service0 = new Service();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        return service0 as T;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(service).toBe(service0);
        });
        it('should execute until the instance is returned if there are multiple beforeInstantiation', () => {
            const fn0 = jest.fn();
            const fn1 = jest.fn();
            const fn2 = jest.fn();

            const app = new ApplicationContext();

            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn0();
                    }
                }
            );
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn1();
                        return new constructor(...args);
                    }
                }
            );
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn2();
                    }
                }
            );
            class Service {
                // PASS
            }

            app.getInstance(Service);
            expect(fn0).toBeCalled();
            expect(fn1).toBeCalled();
            expect(fn2).not.toBeCalled();
        });
    });
    describe('afterInstantiation', () => {
        it('should afterInstantiation receive the correct parameter', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        fn(instance);
                        return instance;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(fn).toBeCalledWith(service);
        });

        // eslint-disable-next-line max-len
        it('should the instance obtained by ApplicationContext be replaced by the instance returned by afterInstantiation', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        const result = new Proxy(instance as object, {}) as T;
                        fn(result);
                        return result;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(fn).toBeCalledWith(service);
        });
    });
});