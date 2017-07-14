/**
 * @param {Symbol} relation
 * @return {Object}
 */
export function hasOne (relation, key = 'owns') {
  return {
    provide () {
      return {
        [relation]: this
      }
    },
    data () {
      return {
        [key]: null
      }
    },
    created () {
      this.$relations = this.$relations || {}
      this.$relations[relation] = {
        register: member => {
          this[key] = member
        }
      }
    }
  }
}

/**
 * @param {Symbol} relation
 * @return {Object}
 */
export function hasMany (relation, key = 'owns') {
  return {
    provide () {
      return {
        [relation]: this
      }
    },
    data () {
      return {
        [key]: []
      }
    },
    created () {
      this.$relations = this.$relations || {}
      this.$relations[relation] = {
        register: member => {
          this[key] = [...this[key], member]
        }
      }
    }
  }
}

/**
 * @param {Symbol} relation
 * @return {Object}
 */
export function memberOf (relation, key = 'owner') {
  return {
    inject: {
      [key]: relation
    },
    data () {
      return {
        [key]: this[key]
      }
    },
    created () {
      if (this[key]) {
        this[key].$relations[relation].register(this)
      }
    }
  }
}
