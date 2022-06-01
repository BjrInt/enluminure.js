// @ts-nocheck
const createModal = (content, cb:Function, enluminure, readonly=false) => {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const modal = document.createElement('modal')

  const escText = document.createElement('p')
  escText.innerText = '(press escape to close)'
  modal.appendChild(escText)

  const textarea = document.createElement('textarea')
  textarea.innerText = content
  textarea.readOnly = readonly
  textarea.addEventListener('click', e => e.target.select())
  modal.appendChild(textarea)

  if(!readonly){
    const loadPreset = document.createElement('button')
    loadPreset.className = "load-button"
    loadPreset.innerText = "Load preset"
    loadPreset.addEventListener('click', () => {
      const values = JSON.parse(textarea.value)
      enluminure.setOptions(values)

      cb()
      overlay.remove()
    })

    modal.appendChild(loadPreset)
  }
  
  overlay.appendChild(modal)

  document.addEventListener('keyup', e => {
    if(e.code === 'Escape'){
      overlay.remove()
    }
  })

  overlay.addEventListener('click', e => {
    if(e.target.className === 'modal-overlay')
      overlay.remove()
  })

  document.body.appendChild(overlay)
}

export default createModal