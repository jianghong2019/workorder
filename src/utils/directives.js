/**
 * Vue 3 自定义指令集合
 * 注意：Vue 3 中指令的生命周期钩子已更改
 * - bind -> beforeMount
 * - inserted -> mounted
 * - update -> updated
 * - componentUpdated -> beforeUpdate
 * - unbind -> unmounted
 */

/**
 * v-dialogDrag: 弹窗拖拽指令
 * 用于 Element Plus 的 el-dialog 组件
 * 使用方式：<el-dialog v-dialogDrag>...</el-dialog>
 */
export const dialogDrag = {
  mounted(el) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')

    if (!dialogHeaderEl || !dragDom) return

    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性
    const sty = window.getComputedStyle(dragDom, null)

    // 记录初始位置
    let initialLeft = 0
    let initialTop = 0

    if (sty.left === 'auto' || !sty.left) {
      initialLeft = 0
    } else {
      initialLeft = parseFloat(sty.left) || 0
    }

    if (sty.top === 'auto' || !sty.top) {
      initialTop = 0
    } else {
      initialTop = parseFloat(sty.top) || 0
    }

    let disX = 0
    let disY = 0

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      disX = e.clientX - dragDom.offsetLeft
      disY = e.clientY - dragDom.offsetTop

      document.onmousemove = (e) => {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l}px`
        dragDom.style.top = `${t}px`
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}

/**
 * v-debounce: 防抖指令
 * 规定时间内 (默认 300 毫秒) 最后一次点击有效
 *
 * @param {Number} [time=300] - 间隔时间，毫秒
 * @param {Function} fn - 执行函数
 * @param {String} [event='click'] - 事件类型
 *
 * 使用方式：
 * <el-button v-debounce="[handleRefresh, 'click', 300]">刷新</el-button>
 * 或简写：
 * <el-button v-debounce="[handleRefresh]">刷新</el-button>
 */
export const debounce = {
  mounted(el, binding) {
    // 解构赋值，定义 3 个变量
    const [fn, event = 'click', time = 300] = binding.value
    let timer

    if (typeof fn !== 'function') {
      console.warn('v-debounce 指令的第一个参数必须是函数')
      return
    }

    el.addEventListener(event, () => {
      // 判断计时器是否存在，存在则清除计时器，重新创建计时器，到时间后执行函数 fn
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn()
      }, time)
    })
  },
}

/**
 * v-throttle: 节流指令
 * 规定时间内只执行一次
 *
 * @param {Number} [time=300] - 间隔时间，毫秒
 * @param {Function} fn - 执行函数
 * @param {String} [event='click'] - 事件类型
 *
 * 使用方式：
 * <el-button v-throttle="[handleClick, 'click', 300]">提交</el-button>
 * 或简写：
 * <el-button v-throttle="[handleClick]">提交</el-button>
 */
export const throttle = {
  mounted(el, binding) {
    const [fn, event = 'click', time = 300] = binding.value
    let lastTime = 0

    if (typeof fn !== 'function') {
      console.warn('v-throttle 指令的第一个参数必须是函数')
      return
    }

    el.addEventListener(event, () => {
      const now = Date.now()
      if (now - lastTime > time) {
        lastTime = now
        fn()
      }
    })
  },
}

/**
 * v-permission: 权限指令
 * 根据用户权限控制元素显示/隐藏
 *
 * @param {Array} value - 权限码数组
 *
 * 使用方式：
 * <el-button v-permission="['admin']">管理按钮</el-button>
 */
export const permission = {
  mounted(el, binding) {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value
      const hasPermission = permissions.includes('admin') // 这里需要根据实际权限逻辑修改

      if (!hasPermission) {
        // 移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('v-permission 指令需要传入权限码数组')
    }
  },
}

/**
 * v-copy: 复制文本指令
 * 点击元素复制文本到剪贴板
 *
 * 使用方式：
 * <span v-copy="'要复制的文本'">点击复制</span>
 * 或
 * <span v-copy="textValue">点击复制</span>
 */
export const copy = {
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      const text = binding.value

      if (!text) {
        console.warn('v-copy 指令需要传入要复制的文本')
        return
      }

      try {
        await navigator.clipboard.writeText(text)
        // 可以在这里添加复制成功的提示
        console.log('复制成功')
      } catch (err) {
        console.error('复制失败:', err)
      }
    })
  },
}

/**
 * v-lazy: 图片懒加载指令
 * 当图片进入可视区域时才加载
 *
 * 使用方式：
 * <img v-lazy="'image-url.jpg'" alt="图片" />
 * 或
 * <img v-lazy="imageUrl" alt="图片" />
 */
export const lazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = binding.value
            if (src) {
              el.src = src
              observer.unobserve(el)
            }
          }
        })
      },
      {
        rootMargin: '50px', // 提前 50px 开始加载
      }
    )

    observer.observe(el)
  },
  unmounted(el) {
    // 清理观察器
  },
}

/**
 * v-longpress: 长按指令
 * 长按指定时间后触发事件
 *
 * @param {Number} [time=500] - 长按时间，毫秒
 * @param {Function} fn - 回调函数
 *
 * 使用方式：
 * <button v-longpress="[handleLongPress, 500]">长按按钮</button>
 * 或
 * <button v-longpress="[handleLongPress]">长按按钮</button>
 */
export const longpress = {
  mounted(el, binding) {
    const [fn, time = 500] = Array.isArray(binding.value)
      ? binding.value
      : [binding.value, 500]

    if (typeof fn !== 'function') {
      console.warn('v-longpress 指令需要传入回调函数')
      return
    }

    let timer = null
    let isMoved = false

    const start = () => {
      isMoved = false
      timer = setTimeout(() => {
        fn()
        timer = null
      }, time)
    }

    const cancel = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const move = () => {
      isMoved = true
      cancel()
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    el.addEventListener('mouseup', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('mouseleave', cancel)

    el.addEventListener('mousemove', move)
  },
}

/**
 * v-dblclick: 双击指令
 * 增强版双击指令，支持自定义时间间隔
 *
 * @param {Number} [interval=300] - 双击间隔，毫秒
 * @param {Function} fn - 回调函数
 *
 * 使用方式：
 * <div v-dblclick="[handleDblClick, 300]">双击区域</div>
 */
export const dblclick = {
  mounted(el, binding) {
    const [fn, interval = 300] = Array.isArray(binding.value)
      ? binding.value
      : [binding.value, 300]

    if (typeof fn !== 'function') {
      console.warn('v-dblclick 指令需要传入回调函数')
      return
    }

    let lastClickTime = 0

    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - lastClickTime < interval) {
        fn()
      }
      lastClickTime = now
    })
  },
}

/**
 * v-focus: 自动聚焦指令
 * 元素插入 DOM 时自动聚焦
 *
 * 使用方式：
 * <input v-focus />
 */
export const focus = {
  mounted(el) {
    el.focus()
  },
}

/**
 * v-select: 自动选中指令
 * 元素插入 DOM 时自动选中文本
 *
 * 使用方式：
 * <input v-select />
 */
export const select = {
  mounted(el) {
    el.select()
  },
}

/**
 * v-number: 数字输入指令
 * 限制输入框只能输入数字（支持小数）
 *
 * 使用方式：
 * <input v-number />
 * <input v-number:integer />  // 仅整数
 */
export const number = {
  mounted(el, binding) {
    const isInteger = binding.modifiers.integer

    el.addEventListener('input', (e) => {
      let value = e.target.value

      if (isInteger) {
        // 只允许整数
        value = value.replace(/[^0-9]/g, '')
      } else {
        // 允许小数
        value = value.replace(/[^0-9.]/g, '')
        // 只保留第一个小数点
        const parts = value.split('.')
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('')
        }
        // 限制小数位数（可选，这里限制为 2 位）
        if (parts[1] && parts[1].length > 2) {
          value = parts[0] + '.' + parts[1].substring(0, 2)
        }
      }

      e.target.value = value
    })
  },
}

/**
 * v-mask: 输入掩码指令
 * 为输入框添加格式掩码
 *
 * 使用方式：
 * <input v-mask="'phone'" />  // 手机号：138****1234
 * <input v-mask="'idcard'" />  // 身份证：110101********1234
 * <input v-mask="'bankcard'" />  // 银行卡：6222 **** **** 1234
 */
export const mask = {
  mounted(el, binding) {
    const maskType = binding.value

    const masks = {
      phone: (value) => {
        if (!value) return ''
        return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      },
      idcard: (value) => {
        if (!value || value.length < 18) return value
        return value.replace(/(\d{6})\d{8}(\w{4})/, '$1********$2')
      },
      bankcard: (value) => {
        if (!value) return ''
        return value.replace(/(\d{4})\s?/g, '$1 ').trim()
      },
    }

    const formatValue = (value) => {
      if (typeof maskType === 'string' && masks[maskType]) {
        return masks[maskType](value)
      }
      return value
    }

    // 格式化初始值
    el.value = formatValue(el.value)

    // 监听输入
    el.addEventListener('blur', () => {
      el.value = formatValue(el.value)
    })
  },
}

/**
 * v-highlight: 高亮指令
 * 高亮文本中的关键词
 *
 * 使用方式：
 * <p v-highlight="{ text: '要显示的文本', keyword: '关键词', color: 'red' }"></p>
 */
export const highlight = {
  mounted(el, binding) {
    const { text, keyword, color = '#ff4d4f' } = binding.value

    if (!text || !keyword) {
      el.textContent = text || ''
      return
    }

    const regex = new RegExp(`(${keyword})`, 'gi')
    const highlighted = text.replace(
      regex,
      `<span style="color: ${color}; font-weight: bold;">$1</span>`
    )

    el.innerHTML = highlighted
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      highlight.mounted(el, binding)
    }
  },
}


/**
 * v-ripple: 水波纹效果指令
 * 为元素添加 Material Design 风格的水波纹效果
 *
 * 使用方式：
 * <button v-ripple>按钮</button>
 * <button v-ripple="{ color: 'rgba(0, 155, 131, 0.3)' }">按钮</button>
 */
export const ripple = {
  mounted(el, binding) {
    const { color = 'rgba(0, 155, 131, 0.3)' } = binding.value || {}

    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `

      el.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  },
}

// 添加水波纹动画样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// 导出所有指令
export default {
  dialogDrag,
  debounce,
  throttle,
  permission,
  copy,
  lazy,
  longpress,
  dblclick,
  focus,
  select,
  number,
  mask,
  highlight,
  ripple,
}
