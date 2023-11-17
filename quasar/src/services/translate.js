import notify from './notify'

export default () => ({
  translateErrorMessage(message) {
    switch (message) {
      case 'Unauthenticated.':
        return 'Vous devez être connecté pour effectuer cette action'
      case 'You are not allow to join this party':
        return 'Vous n\'êtes pas autorisé à rejoindre cette partie'
      case 'You are not on this party':
        return 'Vous n\'êtes pas dans cette partie'
      case 'Invalid data':
        return 'Données invalides'
      case 'Party not found':
        return 'Partie introuvable'
      case 'Party is finished':
        return 'La partie est terminée'
      case 'These credentials do not match our records.':
        return 'Identifiants incorrects'
      case 'The username has already been taken. (and 1 more error)':
        return 'Nom d\'utilisateur déjà utilisé'
      case 'The email has already been taken.':
        return 'Adresse email déjà utilisée'
      default:
        console.log(message)
        return 'Une erreur est survenue'
    }
  },
  showErrorMessage(message) {
    const translatedMessage = this.translateErrorMessage(message)
    notify().showNegativeNotify(translatedMessage)
  }
})