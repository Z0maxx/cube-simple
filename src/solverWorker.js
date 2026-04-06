self.addEventListener('message', async ev => {
    const { wasmScript, cubeColorNumbers, whiteCross, threadIdx } = ev.data
    const flattened = cubeColorNumbers.flatMap(a => a.flatMap(b => b.flatMap(c => c))).map(n => n.toString())
    const moves = await new Promise(res => {
        var Module = {
            arguments: flattened,
            print: function (text) {
                Module = null
                res(text.trim())
            }
        }

        Module.arguments.push(whiteCross ? '1' : '0', threadIdx.toString())
        eval(wasmScript)
    })

    const response = {
        threadIdx,
        cubeSolve: {
            moves: moves.split(' ').map(m => parseInt(m)),
            error: ''
        }
    }

    postMessage(response)
})