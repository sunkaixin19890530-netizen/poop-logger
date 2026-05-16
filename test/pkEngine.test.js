import { describe, it, expect, vi } from 'vitest'
import { runPKEngine, generatePKChallenge, encodeShareData, decodeShareData } from '../src/utils/share.js'

describe('PK Engine', () => {
  describe('runPKEngine', () => {
    it('should correctly determine winner when challenger has higher stats', () => {
      const challenger = {
        totalScore: 1000,
        totalRecords: 50,
        longestStreak: 10
      }
      const defender = {
        totalScore: 500,
        totalRecords: 25,
        longestStreak: 5
      }
      
      // 为了测试稳定，临时禁用随机事件
      const mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
      
      const result = runPKEngine(challenger, defender)
      
      expect(result.winner).toBe('challenger')
      expect(result.loser).toBe('defender')
      expect(result.isDraw).toBe(false)
      expect(result.dimensions.length).toBe(3)
      
      mathRandomSpy.mockRestore()
    })

    it('should correctly determine winner when defender has higher stats', () => {
      const challenger = {
        totalScore: 500,
        totalRecords: 25,
        longestStreak: 5
      }
      const defender = {
        totalScore: 1000,
        totalRecords: 50,
        longestStreak: 10
      }
      
      const mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
      
      const result = runPKEngine(challenger, defender)
      
      expect(result.winner).toBe('defender')
      expect(result.loser).toBe('challenger')
      
      mathRandomSpy.mockRestore()
    })

    it('should have random event with 20% probability', () => {
      // 测试 100 次，随机事件应该出现约 20 次
      let eventCount = 0
      const testRuns = 100
      
      const challenger = { totalScore: 100, totalRecords: 10, longestStreak: 5 }
      const defender = { totalScore: 100, totalRecords: 10, longestStreak: 5 }
      
      for (let i = 0; i < testRuns; i++) {
        const result = runPKEngine(challenger, defender)
        if (result.randomEvent) eventCount++
      }
      
      // 允许一定误差范围
      expect(eventCount).toBeGreaterThanOrEqual(5)
      expect(eventCount).toBeLessThanOrEqual(40)
    })
  })

  describe('Share Data', () => {
    it('should correctly encode and decode share data', () => {
      const original = {
        type: 'pk_challenge',
        payload: {
          stats: { totalScore: 100, totalRecords: 10 },
          taunt: 'Test taunt',
          timestamp: 123456
        },
        signature: 'test-signature'
      }
      
      const encoded = encodeShareData(original)
      const decoded = decodeShareData(encoded)
      
      expect(decoded).toEqual(original)
    })

    it('should generate valid PK challenge data', () => {
      const stats = { totalScore: 1000, totalRecords: 50, longestStreak: 10 }
      const taunt = 'Come at me!'
      
      const challenge = generatePKChallenge(stats, taunt)
      
      expect(challenge.type).toBe('pk_challenge')
      expect(challenge.payload.stats).toEqual(stats)
      expect(challenge.payload.taunt).toBe(taunt)
      expect(challenge.signature).toBeDefined()
    })
  })
})
