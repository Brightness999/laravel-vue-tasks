import { mount } from '@vue/test-utils';
import TaskModal from './TaskModal.vue';

describe('TaskModal', () => {
  it('renders correctly', async () => {
    const wrapper = mount(TaskModal, {
      propsData: {
        confirm: jest.fn(),
        closeModal: jest.fn(),
        task: {
          id: 1,
          title: 'Test Task',
          description: 'This is a test task',
          category: 'work',
          status: 'todo',
        },
        selectedStatus: '',
      },
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Edit Task');
    expect(wrapper.find('input[name="title"]').element.value).toBe('Test Task');
    expect(wrapper.find('textarea[name="description"]').element.value).toBe('This is a test task');
    expect(wrapper.find('select[name="category"]').element.value).toBe('work');
    expect(wrapper.find('select[name="status"]').element.value).toBe('todo');
    expect(wrapper.find('button[name="submit"]').element.textContent).toBe('Edit');

    const wrapper1 = mount(TaskModal, {
      propsData: {
        confirm: jest.fn(),
        closeModal: jest.fn(),
        task: {},
        selectedStatus: 'inprogress',
      },
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper1.exists()).toBe(true);
    expect(wrapper1.find('h2').text()).toBe('New Task');
    expect(wrapper1.find('input[name="title"]').element.value).toBe('');
    expect(wrapper1.find('textarea[name="description"]').element.value).toBe('');
    expect(wrapper1.find('select[name="category"]').element.value).toBe('');
    expect(wrapper1.find('select[name="status"]').element.value).toBe('inprogress');
    expect(wrapper1.find('select[name="status"]').element.disabled).toBe(true);
    expect(wrapper1.find('button[name="submit"]').element.textContent).toBe('Create');

    const wrapper2 = mount(TaskModal, {
      propsData: {
        confirm: jest.fn(),
        closeModal: jest.fn(),
        task: {},
        selectedStatus: undefined,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper2.exists()).toBe(true);
    expect(wrapper2.find('h2').text()).toBe('New Task');
    expect(wrapper2.find('input[name="title"]').element.value).toBe('');
    expect(wrapper2.find('textarea[name="description"]').element.value).toBe('');
    expect(wrapper2.find('select[name="category"]').element.value).toBe('');
    expect(wrapper2.find('select[name="status"]').element.value).toBe('');
    expect(wrapper2.find('button[name="submit"]').element.textContent).toBe('Create');
  });

  it('creates a new task when the form is submitted', async () => {
    const confirmMock = jest.fn();
    const closeModalMock = jest.fn();

    const wrapper = mount(TaskModal, {
      propsData: {
        confirm: confirmMock,
        closeModal: closeModalMock,
        task: {},
        selectedStatus: 'inprogress',
      },
    });

    const titleInput = wrapper.find('input[name="title"]');
    await titleInput.setValue('New Title');

    const descriptionInput = wrapper.find('textarea[name="description"]');
    await descriptionInput.setValue('New Description');

    const categorySelect = wrapper.find('select[name="category"]');
    await categorySelect.setValue('work');

    const statusSelect = wrapper.find('select[name="status"]');
    await statusSelect.setValue('done');

    const createButton = wrapper.find('[type="submit"]');
    await createButton.trigger('click');

    expect(wrapper.vm.title).toBe('New Title');
    expect(wrapper.vm.description).toBe('New Description');
    expect(wrapper.vm.category).toBe('work');
    expect(wrapper.vm.status).toBe('inprogress');

    const wrapper1 = mount(TaskModal, {
      propsData: {
        confirm: confirmMock,
        closeModal: closeModalMock,
        task: {},
        selectedStatus: undefined,
      },
    });

    const titleInput1 = wrapper1.find('input[name="title"]');
    await titleInput1.setValue('New Title');

    const descriptionInput2 = wrapper1.find('textarea[name="description"]');
    await descriptionInput2.setValue('New Description');

    const categorySelect2 = wrapper1.find('select[name="category"]');
    await categorySelect2.setValue('work');

    const statusSelect2 = wrapper1.find('select[name="status"]');
    await statusSelect2.setValue('done');

    const createButton3 = wrapper1.find('[type="submit"]');
    await createButton3.trigger('click');

    expect(wrapper1.vm.title).toBe('New Title');
    expect(wrapper1.vm.description).toBe('New Description');
    expect(wrapper1.vm.category).toBe('work');
    expect(wrapper1.vm.status).toBe('done');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('cannot creates a new task when the form is submitted', async () => {
    const confirmMock = jest.fn();
    const closeModalMock = jest.fn();

    const wrapper = mount(TaskModal, {
      propsData: {
        confirm: confirmMock,
        closeModal: closeModalMock,
        task: {},
        selectedStatus: undefined,
      },
    });

    const createButton = wrapper.find('[type="submit"]');
    await createButton.trigger('click');
    expect(wrapper.vm.title).toBe(undefined);
    expect(wrapper.vm.description).toBe(undefined);
    expect(wrapper.vm.category).toBe(undefined);
    expect(wrapper.vm.status).toBe(undefined);

    const titleInput = wrapper.find('input[name="title"]');
    await titleInput.setValue('New Title');
    await createButton.trigger('click');
    expect(wrapper.vm.title).toBe('New Title');
    expect(wrapper.vm.description).toBe(undefined);
    expect(wrapper.vm.category).toBe(undefined);
    expect(wrapper.vm.status).toBe(undefined);

    const descriptionInput = wrapper.find('textarea[name="description"]');
    await descriptionInput.setValue('New Description');
    await createButton.trigger('click');
    expect(wrapper.vm.title).toBe('New Title');
    expect(wrapper.vm.description).toBe('New Description');
    expect(wrapper.vm.category).toBe(undefined);
    expect(wrapper.vm.status).toBe(undefined);

    const categorySelect = wrapper.find('select[name="category"]');
    await categorySelect.setValue('work');
    await createButton.trigger('click');
    expect(wrapper.vm.title).toBe('New Title');
    expect(wrapper.vm.description).toBe('New Description');
    expect(wrapper.vm.category).toBe('work');
    expect(wrapper.vm.status).toBe(undefined);

    const statusSelect = wrapper.find('select[name="status"]');
    await statusSelect.setValue('done');
    await createButton.trigger('click');
    expect(wrapper.vm.title).toBe('New Title');
    expect(wrapper.vm.description).toBe('New Description');
    expect(wrapper.vm.category).toBe('work');
    expect(wrapper.vm.status).toBe('done');
  });
});
