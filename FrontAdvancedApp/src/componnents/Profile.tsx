// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import userService, { User } from "../services/user_service";
// import avatar from "../assets/avatar.png"; 
// import { zodResolver } from "@hookform/resolvers/zod"; 
// import {userValidSchema, profileSchema} from "../services/validationSchema_service"
// import { useForm } from "react-hook-form";

// const Profile: React.FC = () => {
//     const location = useLocation();
//     const [loading, setLoading] = useState<boolean>(true);
//     const navigate = useNavigate();
//     const user = location.state
//     const {
//             register,
//             handleSubmit,
//             watch,
//             formState: { errors },
//           } = useForm<userValidSchema>({
//             resolver: zodResolver(profileSchema),
//           });


//     return (
//         <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
//         <h2>Profile</h2>
//         <img
//             src={user.imgUrl ? user.imgUrl : avatar}
//             alt="Profile"
//             style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "10px" }}/>
//         <p><strong>Username:</strong> {user.username}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <button
//             style={{
//             marginTop: "10px",
//             backgroundColor: "blue",
//             color: "white",
//             padding: "10px",
//             border: "none",
//             cursor: "pointer",
//             }}
//             onClick={() => navigate("/home",{state:user})}
//         >
//             Back to Home
//         </button>
//         </div>
//     );
// };

// export default Profile;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, userValidSchema } from "../services/validationSchema_service";
import userService, { User } from "../services/user_service"
import avatar from "../assets/avatar.png";

const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state; 
  const newId = user._id
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(user.img ? URL.createObjectURL(user.img[0]) : avatar);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<userValidSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      password: "", // Empty for security reasons
      img: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) {
        setValue("img", e.target.files);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const onSubmit = async (data: userValidSchema) => {
    try{
        let imgUrl
        if(data.img){
            imgUrl = data.img.toString()
        }
        if (data.img && data.img.length > 0) {
            const { request } = userService.uploadImage(data.img[0]);
            const response = await request;
            imgUrl = response.data.url;
        }
        
        const newUser:User = {
            _id:newId,
            username: data.username,
            email: data.email,
            password: data.password,
            imgUrl: imgUrl
        };
        console.log("newUser    ",newUser)
        const res = await userService.updateProfile(newUser)
    }catch (error) {
        console.error(" error:", error);
      }
  };
  
  
  
  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Profile</h2>

      {/* Image Upload - Only clickable in edit mode */}
      <label htmlFor="profileImage">
        <img
          src={imagePreview}
          alt="Profile"
          style={{ width: "150px", height: "150px", borderRadius: "50%", cursor: isEditing ? "pointer" : "default" }}
        />
      </label>
      {isEditing && (
        <input
          type="file"
          id="profileImage"
          style={{ display: "none" }}
          accept="image/*"
          {...register("img")}
          onChange={handleImageChange}
        />
      )}
      {errors.img && <p style={{ color: "red" }}>{errors.img.message}</p>}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Username:</strong>
            <input type="text" {...register("username")} />
            {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Email:</strong>
            <input type="email" {...register("email")} />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Password:</strong>
            <input type="password" {...register("password")} placeholder="Enter new password" />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            style={{
              marginTop: "10px",
              backgroundColor: "blue",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            style={{
              marginTop: "10px",
              backgroundColor: "gray",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          {/* Read-Only Profile Data */}
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Edit Profile Button */}
          <button
            style={{
              marginTop: "10px",
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </>
      )}

      <button
        style={{
          marginTop: "10px",
          backgroundColor: "gray",
          color: "white",
          padding: "10px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate("/home", { state: user })}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
