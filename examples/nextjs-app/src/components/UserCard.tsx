import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(user.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  return (
    <div className="user-card">
      <div className="user-header">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="user-avatar"
            width={48}
            height={48}
          />
        )}
        <div className="user-info">
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      
      <div className="user-actions">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="btn btn-secondary"
            type="button"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            type="button"
          >
            Delete
          </button>
        )}
      </div>
      
      <div className="user-meta">
        <small>
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}
