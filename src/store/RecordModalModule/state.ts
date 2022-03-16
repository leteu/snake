export interface RecordModalModuleStateInterface {
  modalState: boolean
}

function state(): RecordModalModuleStateInterface {
  return {
    modalState: false
  }
};

export default state;