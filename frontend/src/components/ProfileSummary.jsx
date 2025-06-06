const ProfileSummary = ({ user }) => {
  return (
    <div className="profile-summary">
      <h2>Profil</h2>
      <div>
        <img
          src={user.avatar ? `/img/${user.avatar}` : "/img/default-avatar.png"}
          alt={`${user.firstName} ${user.lastName}`}
          className="profile-avatar"
        />
        <div>
        {user.lastName} 
        {user.firstName} 
        <p>Email: {user.email}</p>
        </div>
        <button>Modifier</button>
      </div>
      <div>
        {user.genre}
        {user.age}
        {user.weight}
        {user.height}
      </div>
    </div>
      );
      };

export default ProfileSummary;