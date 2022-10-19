import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { InstanceScope } from './InstanceScope';

export class PrototypeInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.PROTOTYPE;
    }

    shouldGenerate(): boolean {
        return true;
    }
}
