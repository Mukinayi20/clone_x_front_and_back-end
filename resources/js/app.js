import '../css/app.scss'

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
