/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs'
import { plainToInstance } from 'class-transformer'

interface ClassConstructor {
    new (...args: any[]): {}
}
// this interface helps define the type for our dto to always be of a 
// class type

export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                    // this ensures excluded values are 
                    // definitely removed from the returned value
                })
            })
        )
    }
}