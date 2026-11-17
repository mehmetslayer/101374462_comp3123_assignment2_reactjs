import { pictureUrl } from '../api/employees';

// shows the profile picture, or the initials when there is none
export default function Avatar({ employee, size = 40 }) {
  const style = { width: size, height: size, objectFit: 'cover', fontSize: size * 0.4 };
  const src = pictureUrl(employee.profile_picture);

  if (src) {
    return (
      <img
        src={src}
        alt={`${employee.first_name} ${employee.last_name}`}
        className="rounded-circle border"
        style={style}
      />
    );
  }

  const initials = `${employee.first_name?.[0] ?? ''}${employee.last_name?.[0] ?? ''}`.toUpperCase();
  return (
    <span
      className="rounded-circle bg-secondary-subtle text-secondary-emphasis d-inline-flex align-items-center justify-content-center fw-semibold"
      style={style}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}