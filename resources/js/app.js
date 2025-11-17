document.addEventListener('DOMContentLoaded', function() {
  // const infoProfil = document.querySelectorAll('.content')
  // const content = document.querySelectorAll('.menu')
  // const btnInfo = document.querySelectorAll('.btn_info')

  // console.log(btnInfo)
  // console.log(content)
  // console.log(infoProfil)

  try {
    const modals = document.querySelectorAll('.menu-info')
    const btnInfo = document.querySelectorAll('.btn_info')
    
    btnInfo.forEach((btn) => {
        const modal = btn.nextElementSibling  // le modal juste après le bouton

        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            modal.style.display = 'block'
        })

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none'
            }
        })
    })
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              modals.forEach(m => m.style.display = 'none')
          }
      })
  } catch (error) {
    console.error('Une erreur avec le menu plus de tweets', error)
  }

  const btnLike = document.querySelectorAll('.like-btn')
  console.log(btnLike)
  
  btnLike.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault()
    const id = btn.dataset.id
    if (!id) {
      console.error('ID manquant sur le bouton like')
      return
    }

    try {
      const response = await fetch(`/tweets/${id}/like`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log(data.message)

      const imgIcon = btn.querySelector('.icone-post')
      const likeCountSpan = btn.closest('.tweet-actions')?.querySelector('.like-count')

      if (data.liked) {
        imgIcon.src = '/public/icones/coeur_plein.png'
        imgIcon.alt = 'aimé'
        if (likeCountSpan) likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1
      } else {
        imgIcon.src = '/public/icones/coeur.png'
        imgIcon.alt = 'liker'
        if (likeCountSpan) likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1
      }

    } catch (error) {
      console.error('Erreur dans la requête de like', error)
    }
  })
})

    
    try {
    const Jours = document.getElementById('jour')
    const mois = document.getElementById('mois')
    const annees = document.getElementById('annees')

    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option')
        option.value = i
        option.innerHTML = i
        Jours.appendChild(option)
    }
    const currentYear = new Date().getFullYear()
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option')
        option.value = i
        option.innerHTML = i
        annees.appendChild(option)
    }
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    monthNames.forEach((month, index) => {
      const option = document.createElement('option')
      option.value = index + 1
      option.textContent = month
      mois.appendChild(option)
    })

  } catch (error) {
    console.error('quelque chose ne vas pas avec la date de naissance', error)
  }

  try {
    const modalElement = document.getElementById('staticBackdrop')
    const modal = new bootstrap.Modal(modalElement, {
      backdrop: 'static',
      keyboard: false 
    })
    modal.show()
    modal.hide()
    
    new SimpleMDE({ element: document.getElementById("content") });
  } catch (error) {
    console.error('Queque chose ne va pas avec votre MDE', error)
  }
});

// const btnPlus = document.querySelectorAll('.btn_info')
// console.log(btnPlus)
// const menuPlus = document.querySelectorAll('.modal')
// try {
//   btnPlus.addEventListener('click', () => {
//     console.log('bonjour')
//     menuPlus.style.display = 'blck'
//   })
// } catch (error) {
  
// }