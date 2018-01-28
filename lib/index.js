/**
 * @param {Object} [options={ explicit: false }]
 * @return {Relation}
 */
export function relation (options = {}) {
  const {explicit = false} = options

  return {
    key: Math.random().toString(36).substr(2, 10),
    explicit
  }
}

/**
 * @param {Relation} relation
 * @return {Object}
 */
export function hasOne (relation, key = 'owns') {
  return {
    data () {
      return {
        [key]: null
      }
    },
    provide () {
      return !relation.explicit && {
        [relation.key]: this
      }
    },
    created () {
      this.$relations = this.$relations || {}
      this.$relations[relation.key] = {
        register: member => {
          if (this[key] !== member) {
            this[key] = member
          }
        },
        unregister: member => {
          if (this[key] === member) {
            this[key] = null
          }
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
    data () {
      return {
        [key]: []
      }
    },
    provide () {
      return !relation.explicit && {
        [relation.key]: this
      }
    },
    created () {
      this.$relations = this.$relations || {}
      this.$relations[relation.key] = {
        register: member => {
          const index = indexWithin(this[key], member)

          if (this[key][index] !== member) {
            this[key].splice(index, 0, member)
          }
        },
        unregister: member => {
          const index = this[key].indexOf(member)

          if (index !== -1) {
            this[key].splice(index, 1)
          }
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
    inject: relation.explicit ? {} : {
      [relation.key]: {
        name: relation.key,
        default: null
      }
    },
    props: !relation.explicit ? {} : {
      [key]: {
        type: Object,
        default: null
      }
    },
    data () {
      if (!relation.explicit) {
        return { [key]: this[relation.key] || null }
      }
    },
    mounted () {
      if (this[key]) {
        this[key].$relations[relation.key].register(this)
      }
    },
    beforeDestroy () {
      if (this[key]) {
        this[key].$relations[relation.key].unregister(this)
      }
    }
  }
}

function compareDocumentPosition (a, b) {
  const {
    DOCUMENT_POSITION_PRECEDING,
    DOCUMENT_POSITION_FOLLOWING
  } = document

  if (a === b) {
    return 0
  }

  const position = a.$el.compareDocumentPosition(b.$el)

  if (position & DOCUMENT_POSITION_PRECEDING) {
    return 1
  }

  if (position & DOCUMENT_POSITION_FOLLOWING) {
    return -1
  }

  return 0
}

function indexWithin (array, component) {
  let lo = 0
  let hi = array.length - 1

  while (lo <= hi) {
    const mid = lo + (hi - lo) / 2 | 0

    switch (compareDocumentPosition(component, array[mid])) {
      case -1:
        hi = mid - 1
        break
      case 1:
        lo = mid + 1
        break
      default:
        return mid
    }
  }

  return lo
}
