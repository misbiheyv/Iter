export type RangeTypes = number | string;

export type RangeValues = string | number;

export default class Range<T extends RangeValues> {

    #min: T;

    #max: T;

    #type: RangeTypes;

    constructor(start: T, end: T) {
        this.#min = start;

        this.#max = end;

        this.#type = typeof start;
    }

    [Symbol.iterator](): IterableIterator<T> {
        return this.values();
    }

    public values(): IterableIterator<T> {
        const
            start = typeof this.#min === "number" ? this.#min : codePointAt(this.#min),
            end = typeof this.#max === "number" ? this.#max : codePointAt(this.#max),
            step = end >= start ? 1 : -1;

        let
            current = start - step;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                return {
                    done: current >= end,
                    value: this.toType(current += step)
                }
            }
        }
    }

    public reverse(): IterableIterator<T> {
        const
            start = typeof this.#max === "number" ? this.#max : codePointAt(this.#max),
            end = typeof this.#min === "number" ? this.#min : codePointAt(this.#min),
            step = end >= start ? 1 : -1;

        let
            current = start - step;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                return {
                    done: current <= end,
                    value: this.toType(current += step)
                }
            }
        }
    }

    private toType(value: number): T {
        switch (this.#type) {
            case 'string':
                return <T>String.fromCodePoint(value);

            default:
                return <T>value;
        }
    }

}

function codePointAt(str: string, pos: number = 0): number {
    const v = str.codePointAt(pos);
    return v == null || Number.isNaN(v) ? NaN : v;
}