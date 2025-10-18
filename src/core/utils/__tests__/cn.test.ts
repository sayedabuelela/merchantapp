import {cn} from "../cn";

describe('cn utility function', () => {
    it('should multiple class names', () => {
        const result = cn('font-bold', 'text-center');
        expect(result).toBe('font-bold text-center');
    });

    it('should return empty string if no class names are provided', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should handles conditional classes with objects', () => {
        const result = cn('font-bold', {active: true});
        expect(result).toBe('font-bold active');
    });

    it('should handles conditional classes with booleans', () => {
        const result = cn('font-bold', true);
        expect(result).toBe('font-bold');
    });

    it('should handles conditional classes with arrays', () => {
        const result = cn('font-bold', ['active', 'text-center']);
        expect(result).toBe('font-bold active text-center');
    });

    it('should filters out falsy values', () => {
        const result = cn('base-class', null, undefined, false, 0, '', 'valid-class');
        expect(result).toBe('base-class valid-class');
    });

    it('works with dynamic class generation', () => {
        const isActive = true;
        const isDisabled = false;
        const result = cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled');
        expect(result).toBe('btn btn-active');
    });

});
