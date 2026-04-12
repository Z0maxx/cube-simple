self.addEventListener('message', async ev => {
    const { wasmScript, cubeColorNumbers, whiteCross, threadIdx, longestSequence } = ev.data
    const flattened = cubeColorNumbers.flatMap(a => a.flatMap(b => b.flatMap(c => c))).map(n => n.toString())
    const result = await new Promise(res => {
        var Module = {
            arguments: flattened,
            print: function (text) {
                Module = null
                res(text.trim())
            }
        }

        Module.arguments.push(whiteCross ? '1' : '0', threadIdx.toString(), longestSequence ? '0' : '1')
        eval(wasmScript)
    })

    let moves
    if (whiteCross) {
        moves = result.length === 1 ? [] : result
            .split(' ')
            .slice(0, -1)
            .map(m => parseInt(m))
    }
    else {
        moves = result.length === 0 ? [] : result
            .split(' ')
            .map(m => parseInt(m))
    }

    const response = {
        threadIdx,
        cubeSolve: {
            moves,
            error: ''
        }
    }

    if (whiteCross) {
        response.isWhite = result[result.length - 1] === '1'
    }

    postMessage(response)
})