const usePostRedirect = () => {
  const perform = (url: string, data: any) => {
    const form = document.createElement('form')
    
    form.setAttribute('action', url)
    form.setAttribute('method', 'POST')

    Object.keys(data).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('name', key)
      const val = data[key]
      input.setAttribute('value', typeof val === 'object' ? JSON.stringify(val) : val)
      
      form.appendChild(input)
    })
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  return {
    perform
  }
}

export {usePostRedirect}