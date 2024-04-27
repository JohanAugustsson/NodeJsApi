import 'reflect-metadata';
import { injectable } from 'tsyringe';

// Define a decorator to mark a class as a controller
export function Controller(routePrefix: string = ''): ClassDecorator {
    return function (target: any) {
        injectable()(target); // Ensure the class is injectable
        Reflect.defineMetadata('routePrefix', routePrefix, target);
    };
}
