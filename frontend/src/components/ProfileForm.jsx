import { useEffect, useState } from "react";
import "../../src/style/ProfileForm.css";
import "../../src/style/Global.css";

const ProfileForm = ({ formik, errorMessage, userData }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        password: "",
        repeatPassword: "",
        avatar: userData.avatar || "",
        gender: userData.gender || "",
        birthDate: userData.birth_date ? userData.birth_date.split('T')[0] : "",
      });
      
      if (userData.avatar) {
        const backendUrl = 'http://localhost:8080';
        const timestamp = new Date().getTime();
        const avatarUrl = `${backendUrl}/img/${userData.avatar}?t=${timestamp}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [userData, formik.setValues]);

  const handleAvatarChange = (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      formik.setFieldError("avatar", "Seules les images sont acceptées");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    formik.setFieldValue("avatar", file);
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const getAvatarUrl = () => {
    if (!avatarPreview) return null;
    return avatarPreview;
  };

  return (
    <div className="home-container">
      <div className="profile-form-wrapper">
        <h1 className="profile-form-title">MODIFIER LE PROFIL</h1>

        <div className="avatar-preview-container">
          <label htmlFor="avatar" className="avatar-upload-label">
            {avatarPreview ? (
              <img 
                src={getAvatarUrl()}
                alt="Avatar actuel" 
                className="avatar-preview-image"
                onError={() => setAvatarPreview(null)}
              />
            ) : (
              <div className="avatar-placeholder">
                <span>Cliquez pour ajouter un avatar</span>
              </div>
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="avatar-upload-input"
              accept="image/*"
              onChange={handleAvatarChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.touched.avatar && formik.errors.avatar && (
            <div className="profile-error">{formik.errors.avatar}</div>
          )}
        </div>

        <div className="profile-form-scroll-container">
          <form onSubmit={formik.handleSubmit} className="profile-form">
            <div className="profile-input-fields-wrapper">
              <div className="profile-display-field-wrapper">
                <label htmlFor="firstName" className="profile-form-label">
                  Prénom
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="profile-form-input"
                    placeholder={userData?.first_name ? "" : "ex. Marine"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="profile-error">{formik.errors.firstName}</div>
                  )}
                </label>

                <label htmlFor="lastName" className="profile-form-label">
                  Nom de famille
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="profile-form-input"
                    placeholder={userData?.last_name ? "" : "ex. Dupont"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="profile-error">{formik.errors.lastName}</div>
                  )}
                </label>
              </div>
              <label htmlFor="email" className="profile-form-label">
                Email
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="profile-form-input"
                  placeholder={userData?.email ? "" : "ex. marine@gmail.com"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="profile-error">{formik.errors.email}</div>
                )}
              </label>
              <div className="profile-display-field-wrapper">
                <label htmlFor="gender" className="profile-form-label">
                  Genre
                  <select
                    name="gender"
                    id="gender"
                    className="profile-form-input"
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
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="profile-error">{formik.errors.gender}</div>
                  )}
                </label>

                <label htmlFor="birthDate" className="profile-form-label">
                  Date de naissance
                  <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    className="profile-form-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.birthDate}
                  />
                  {formik.touched.birthDate && formik.errors.birthDate && (
                    <div className="profile-error">{formik.errors.birthDate}</div>
                  )}
                </label>
              </div>
              <div className="profile-display-field-wrapper">
                <label htmlFor="password" className="profile-form-label">
                  Nouveau mot de passe
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="profile-form-input"
                    placeholder="ex. MotDePasse1?"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="profile-error">{formik.errors.password}</div>
                  )}
                </label>

                <label htmlFor="repeatPassword" className="profile-form-label">
                  Confirmez le nouveau mot de passe
                  <input
                    type="password"
                    name="repeatPassword"
                    id="repeatPassword"
                    className="profile-form-input"
                    placeholder="ex. MotDePasse1?"
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("repeatPassword", true, true)}
                    value={formik.values.repeatPassword}
                  />
                  {formik.touched.repeatPassword && formik.errors.repeatPassword && (
                    <div className="profile-error">{formik.errors.repeatPassword}</div>
                  )}
                </label>
              </div>
            </div>

            {formik.errors.api && <div className="profile-error profile-api-error">{formik.errors.api}</div>}
            {errorMessage && <div className="profile-error-message">{errorMessage}</div>}

            <button
              className="profile-register-button"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Enregistrement en cours..." : "Mettre à jour"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;