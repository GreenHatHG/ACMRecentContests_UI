import { mount } from '@vue/test-utils'
import D2ContainerFrame from '@/dialog/d2-container-frame/index.vue'

describe('d2-container-frame', () => {
  // 存在且是Vue组件实例
  it('is a vue instance', () => {
    const wrapper = mount(D2ContainerFrame, {
      stubs: ['d2-container']
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // 包含特定类名
  it('contains specific classnames', () => {
    const wrapper = mount(D2ContainerFrame, {
      stubs: ['d2-container']
    })

    expect(wrapper.contains('.d2-container-frame')).toBeTruthy()
  })

  // props
  it('has props', () => {
    const wrapper = mount(D2ContainerFrame, {
      stubs: ['d2-container'],
      propsData: {
        src: 'https://doc.d2admin.fairyever.com/zh/'
      }
    })

    expect(wrapper.props().src).toEqual('https://doc.d2admin.fairyever.com/zh/')
  })
})
