const RegisterForm = ({ formik, errorMessage }) => (
  //Ce fragment de code crée des champs du formulaire permettant à l'utilisateur de saisir ses données d'inscription
  //Formik suit l'utilisateur et gère les éventuelles erreurs
  <form onSubmit={formik.handleSubmit}>
    <h1>S'inscrire</h1>
    {/* htmlFor associe un label à un champ de formulaire */}
    <label htmlFor="firstName">
      Prénom:
      <input
        type="text"
        name="firstName"
        id="firstName"
        placeholder="ex. Marine"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div className="error">{formik.errors.firstName}</div>
      ) : null}
    </label>
    <label htmlFor="lastName">
      Nom de famille:
      <input
        type="text"
        name="lastName"
        id="lastName"
        placeholder="ex. Marine"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div className="error">{formik.errors.lastName}</div>
      ) : null}
    </label>

    <label htmlFor="email">
      Email:
      <input
        type="email"
        name="email"
        id="email"
        placeholder="ex. marine@gmail.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}
    </label>
    <label htmlFor="password">
      Le mot de passe:
      <input
        type="password"
        name="password"
        id="password"
        placeholder="ex. MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password ? (
        <div className="error">{formik.errors.password}</div>
      ) : null}
    </label>
    <label htmlFor="repeatPassword">
      Confirmez le mot de passe:
      <input
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        placeholder="ex. MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={() => formik.setFieldTouched("repeatPassword", true, true)}
        value={formik.values.repeatPassword}
      />
      {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
        <div className="error">{formik.errors.repeatPassword}</div>
      ) : null}
    </label>
    <label htmlFor="avatar">
      Photo de profil:
      <input
        type="file"
        name="avatar"
        id="avatar"
        accept="image/*"
        onChange={(event) => {
          formik.setFieldValue("avatar", event.currentTarget.files[0]);
        }}
        onBlur={formik.handleBlur}
      />
      {formik.touched.avatar && formik.errors.avatar ? (
        <div className="error">{formik.errors.avatar}</div>
      ) : null}
    </label>
    <label htmlFor="gender">
      Genre:
      <select
        name="gender"
        id="gender"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.gender}
      >
        <option value="">Sélectionnez</option>
        <option value="male">Homme</option>
        <option value="female">Femme</option>
        <option value="non_binary">Non-binaire</option>
        <option value="other">Autre</option>
      </select>
      {formik.touched.gender && formik.errors.gender ? (
        <div className="error">{formik.errors.gender}</div>
      ) : null}
    </label>

    <label htmlFor="birthDate">
      Date de naissance:
      <input
        type="date"
        name="birthDate"
        id="birthDate"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.birthDate}
      />
      {formik.touched.birthDate && formik.errors.birthDate ? (
        <div className="error">{formik.errors.birthDate}</div>
      ) : null}
    </label>
    {/* Affichage des erreurs du formik et du backend */}
    {formik.errors.api && <div>{formik.errors.api}</div>}
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    <button className="login-btn" type="submit" disabled={formik.isSubmitting}>
      S'inscrire
    </button>
  </form>
);

export default RegisterForm;
