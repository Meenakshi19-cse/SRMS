import { DataTypes } from 'sequelize';
import { sequelize } from '../config/mysql.js';

const StudentDetails = sequelize.define('StudentDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'Userid',
    },
    onDelete: 'CASCADE',
  },
  regno: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Deptid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Department',
      key: 'Deptid',
    },
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Semester: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'Userid',
    },
  },
  Created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'Userid',
    },
    field: 'Created_by'
  },
  Updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'Userid',
    },
    field: 'Updated_by'
  },
  date_of_joining: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  blood_group: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tutorEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personal_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_graduate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  aadhar_card_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  student_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mother_tongue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  identification_mark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extracurricularID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Extracurricular',
      key: 'id',
    },
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  caste: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  community: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seat_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  door_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cityID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cities',
      key: 'id',
    },
  },
  districtID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'districts',
      key: 'id',
    },
  },
  stateID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'states',
      key: 'id',
    },
  },
  countryID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'countries',
      key: 'id',
    },
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personal_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pending: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  tutor_approval_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  Approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'Userid',
    },
    field: 'Approved_by'
  },
  approved_at: {
    type: DataTypes.DATE,
  },
  messages: {
    type: DataTypes.JSON,
  },
  skillrackProfile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
}, {
  
  tableName: 'student_details',
   timestamps: false 
});

export default StudentDetails;
