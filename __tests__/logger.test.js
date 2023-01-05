'use strict'

const logger = require('../src/middleware/logger')

describe('Logger Test', () => {
    let consoleLog
    let req = {path: '/food'}
    let res = {}
    let next = jest.fn()
    beforeEach(() => {
        consoleLog = jest.spyOn(console, 'log').mockImplementation()
    })
    afterEach(() => {
        consoleLog.mockRestore()
    })

    it('logs', () => {
        logger(req, res, next)
        expect(consoleLog).toHaveBeenCalledWith(req.path)
    })
    
    it('calls next', async () => {
        logger(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})
