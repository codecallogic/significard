export const manageTags = (initialize, data) => {
  const input = document.getElementById('researchInterests')
  const tagContainer = document.querySelector('.form-tag-container')

  let tags = []

  // LOAD TAGS FROM DATABASE
  if(initialize === 'interests'){
    if(data){
      tags = data.map( (item) => {
        return item.tag
      })
      addTags()
    }
  }

  // ADD INPUT VALUE TO ARRAY TAGS
  
  if(initialize === 'addTag'){
    input.value.length > 0 ? tags.push(input.value) : null
    addTags()
    input.value = '';
    input.focus()
  }

  function addTags(){
    tags.slice().reverse().forEach( t => {
      const tag = createTag(t)
      tagContainer.prepend(tag)
    })
    let tagValues = document.querySelectorAll(".tag > span")
    let postHidden = document.getElementById("tagValue")
    let values = []
    tagValues.forEach( e => {
      values.push(e.innerText)
    })
    postHidden.setAttribute('value', values)
  }

  function reset(){
    document.querySelectorAll('.tag').forEach( t => {
      t.parentElement.removeChild(t)
    })
  }

  function createTag(label){
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
    const span = document.createElement('span')
    span.innerHTML = label

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const SVG_XLINK = "http://www.w3.org/1999/xlink";
    let closeIcon = document.createElementNS(SVG_NS, 'svg');
    closeIcon.setAttribute('data-item', label)

    let use = document.createElementNS(SVG_NS, 'use');
    use.setAttributeNS(SVG_XLINK, 'xlink:href', '/sprite.svg#icon-cross');
    use.setAttribute('data-item', label)
    use.setAttribute('class', 'form-tag')
    closeIcon.appendChild(use)

    div.appendChild(span)
    div.appendChild(closeIcon)

    return div
  }
}