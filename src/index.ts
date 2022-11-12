(async function() {
    Array.prototype[Symbol.asyncIterator] = () => {
        let i = 0;

        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => {
                return new Promise(res => setTimeout(() => res(++i), 1e3))
                    .then(res => ({
                        done: i > 6,
                        value: res
                    }))
            }
        }
    }

    for await (const el of []) {
        console.log(el)
    }
})()
