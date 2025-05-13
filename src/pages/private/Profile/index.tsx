import React from 'react';
import './Profile.css';
import { RolesEnum } from '@/types/global.enum';

export interface UserProps {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: RolesEnum;
  foto?: string;
  estado: boolean;
}

interface ProfileProps {
  user?: UserProps;
}

const defaultUser: UserProps = {
  id: 1,
  nombre: 'Usuario de Prueba ',
  email: 'usuario@ejemplo.com',
  role: RolesEnum.USER,
  estado: true,
  foto: 'https://i.pravatar.cc/300?img=12',
};

const Profile: React.FC<ProfileProps> = ({ user = defaultUser }) => (
  <div className="profile-container">
    <div className="profile-wrapper">

      {/* FOTO + NOMBRE + ROL */}
      <div className="card card-photo">
        <img src={user.foto} alt={user.nombre} />
        <div className="name">{user.nombre}</div>
        <div className="role">{user.role.toLowerCase()}</div>
      </div>

      {/* DETALLES DE PERFIL */}
      <div className="card card-info">
        <h3>Detalles de Perfil</h3>
        <ul className="info-list">
          <li className="info-item">
            <label>ID:</label><span>{user.id}</span>
          </li>
          <li className="info-item">
            <label>Nombre:</label><span>{user.nombre}</span>
          </li>
          <li className="info-item">
            <label>Email:</label><span>{user.email}</span>
          </li>
          <li className="info-item">
            <label>Rol:</label><span>{user.role.toLowerCase()}</span>
          </li>
          <li className="info-item">
            <label>Estado:</label><span>{user.estado ? 'Activo' : 'Inactivo'}</span>
          </li>
        </ul>
      </div>

      {/* MANTENIMIENTO */}
      <div className="maintenance-wrapper">
        <div className="card-maintenance">
          <p>Por el momento<br/>en mantenimiento</p>
        </div>
        <div className="card-maintenance">
          <p>Por el momento<br/>en mantenimiento</p>
        </div>
      </div>

    </div>
  </div>
);

export default Profile;
