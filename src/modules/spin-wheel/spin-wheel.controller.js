import { success, error } from '../../utils/apiResponse.js'

export class SpinWheelController {
  constructor(service) {
    this.service = service
  }

  _actorCtx(request) {
    return {
      userId: request.user?.id ?? null,
      role: request.user?.role ?? null,
      platformRole: request.user?.platform_role ?? request.user?.platformRole ?? null,
      ip: request.ip ?? null,
      userAgent: request.headers?.['user-agent'] ?? null,
    }
  }

  // ─── Customer ───────────────────────────────────────────

  /** GET /config */
  async config(request, reply) {
    const prizes = await this.service.getActivePrizesForCustomer(request.user?.id ?? null)
    return reply.code(200).send(success(prizes, 'Spin wheel config fetched'))
  }

  /** GET /appearance */
  async appearance(request, reply) {
    const data = await this.service.getAppearanceForCustomer()
    return reply.code(200).send(success(data, 'Spin wheel appearance fetched'))
  }

  /** GET /eligibility */
  async eligibility(request, reply) {
    const data = await this.service.getEligibility(request.user.id)
    return reply.code(200).send(success(data, 'Spin eligibility fetched'))
  }

  /** POST /spin */
  async spin(request, reply) {
    const result = await this.service.spin(request.user.id)
    if (!result.success) {
      return reply.code(200).send(success(result, result.message))
    }
    return reply.code(200).send(success(result, 'Spin resolved'))
  }

  // ─── Admin: prizes ──────────────────────────────────────

  async listPrizes(request, reply) {
    const prizes = await this.service.listPrizes()
    return reply.code(200).send(success(prizes, 'Spin prizes fetched'))
  }

  async createPrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.createPrize(request.body, actor)
    if (!result.success) {
      return reply.code(400).send(error(result.message, 'VALIDATION_ERROR'))
    }
    return reply.code(201).send(success(result.prize, 'Spin prize created'))
  }

  async updatePrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.updatePrize(request.params.id, request.body, actor)
    if (!result.success) {
      const code = result.message === 'Prize not found' ? 404 : 400
      return reply.code(code).send(error(result.message, code === 404 ? 'NOT_FOUND' : 'VALIDATION_ERROR'))
    }
    return reply.code(200).send(success(result.prize, 'Spin prize updated'))
  }

  async deletePrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.deletePrize(request.params.id, actor)
    if (!result.success) {
      return reply.code(404).send(error(result.message, 'NOT_FOUND'))
    }
    return reply.code(200).send(success(null, 'Spin prize deleted'))
  }

  async reorderPrizes(request, reply) {
    const actor = this._actorCtx(request)
    await this.service.reorderPrizes(request.body.orderedIds, actor)
    return reply.code(200).send(success(null, 'Spin prizes reordered'))
  }

  // ─── Admin: first-time reward prizes ─────────────────────

  async listFirstTimePrizes(request, reply) {
    const prizes = await this.service.listFirstTimePrizes()
    return reply.code(200).send(success(prizes, 'First-time spin prizes fetched'))
  }

  async createFirstTimePrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.createFirstTimePrize(request.body, actor)
    if (!result.success) {
      return reply.code(400).send(error(result.message, 'VALIDATION_ERROR'))
    }
    return reply.code(201).send(success(result.prize, 'First-time spin prize created'))
  }

  async updateFirstTimePrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.updateFirstTimePrize(request.params.id, request.body, actor)
    if (!result.success) {
      const code = result.message === 'Prize not found' ? 404 : 400
      return reply.code(code).send(error(result.message, code === 404 ? 'NOT_FOUND' : 'VALIDATION_ERROR'))
    }
    return reply.code(200).send(success(result.prize, 'First-time spin prize updated'))
  }

  async deleteFirstTimePrize(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.deleteFirstTimePrize(request.params.id, actor)
    if (!result.success) {
      return reply.code(404).send(error(result.message, 'NOT_FOUND'))
    }
    return reply.code(200).send(success(null, 'First-time spin prize deleted'))
  }

  async reorderFirstTimePrizes(request, reply) {
    const actor = this._actorCtx(request)
    await this.service.reorderFirstTimePrizes(request.body.orderedIds, actor)
    return reply.code(200).send(success(null, 'First-time spin prizes reordered'))
  }

  // ─── Admin: settings ────────────────────────────────────

  async getSettings(request, reply) {
    const settings = await this.service.getSettings()
    return reply.code(200).send(success(settings, 'Spin wheel settings fetched'))
  }

  async updateSettings(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.updateSettings(request.body, actor)
    return reply.code(200).send(success(result.settings, 'Spin wheel settings updated'))
  }

  // ─── Admin: milestone rules ──────────────────────────────

  async listMilestoneRules(request, reply) {
    const rules = await this.service.listMilestoneRules()
    return reply.code(200).send(success(rules, 'Spin milestone rules fetched'))
  }

  async createMilestoneRule(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.createMilestoneRule(request.body, actor)
    if (!result.success) {
      return reply.code(400).send(error(result.message, 'VALIDATION_ERROR'))
    }
    return reply.code(201).send(success(result.rule, 'Spin milestone rule created'))
  }

  async updateMilestoneRule(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.updateMilestoneRule(request.params.id, request.body, actor)
    if (!result.success) {
      return reply.code(404).send(error(result.message, 'NOT_FOUND'))
    }
    return reply.code(200).send(success(result.rule, 'Spin milestone rule updated'))
  }

  async deleteMilestoneRule(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.deleteMilestoneRule(request.params.id, actor)
    if (!result.success) {
      return reply.code(404).send(error(result.message, 'NOT_FOUND'))
    }
    return reply.code(200).send(success(null, 'Spin milestone rule deleted'))
  }

  // ─── Admin: manual grant + history ───────────────────────

  async grantSpins(request, reply) {
    const actor = this._actorCtx(request)
    const result = await this.service.grantSpins(request.body.userId, request.body.amount, actor)
    if (!result.success) {
      return reply.code(400).send(error(result.message, 'VALIDATION_ERROR'))
    }
    return reply.code(200).send(success(result, 'Spins granted'))
  }

  async listHistory(request, reply) {
    const { limit, offset, userId } = request.query
    const data = await this.service.listHistory({
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
      userId: userId || null,
    })
    return reply.code(200).send(success(data, 'Spin history fetched'))
  }
}
