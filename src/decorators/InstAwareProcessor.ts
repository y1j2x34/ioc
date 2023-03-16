import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { InstAwareProcessorMetadata } from '../metadata/InstAwareProcessorMetadata';

export function InstAwareProcessor() {
    return function <Cls extends Newable<PartialInstAwareProcessor>>(target: Cls) {
        const metadata = MetadataFactory.getMetadata(target, InstAwareProcessorMetadata);
        metadata.recordProcessorClass(target as Cls);
        return target;
    };
}
