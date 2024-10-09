import { shallowMount } from '@vue/test-utils';
import Button from '@/components/Button.vue';

describe('Button.vue', () => {
  it('renders props.msg when passed', () => {
    const title = 'some title';
    const wrapper = shallowMount(Button, {
      props: { title },
    });
    expect(wrapper.text()).toMatch(title);
  });
});
