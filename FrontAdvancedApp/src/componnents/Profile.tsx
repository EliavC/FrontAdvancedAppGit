
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, userValidSchema } from "../services/validationSchema_service";
import userService, { User } from "../services/user_service";
import avatar from "../assets/avatar.png";
import PostList from "./PostsList";
import CommentsList from "./CommentsList";
import "./profileHome.css"; 

const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(
    location.state || JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<userValidSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      password: "",
    },
  });

  const img = watch("img");
  const imagePreview = img?.[0] ? URL.createObjectURL(img[0]) : user.imgUrl || avatar;
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?._id) {
      setUser(storedUser);
    }
  }, []);
  const onSubmit = async (data: userValidSchema) => {
    try {
      setErrorMessage(null);
      let imgUrl = user.imgUrl;

      if (data.img && data.img.length > 0 && data.img[0] instanceof File) {
        const { request } = userService.uploadImage(data.img[0]);
        const response = await request;
        imgUrl = response.data.url;

      }

      const updatedUser: User = {
        _id: user._id,
        username: data.username,
        email: data.email,
        password: data.password,
        imgUrl:imgUrl,
      };

      await userService.updateProfile(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", textAlign: "center", paddingBottom: "60px" }}>
      <h2>{user.username}'s Profile</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!isEditing && (
      <label htmlFor="profileImage">
        <img src={imagePreview} alt="Profile" style={{ width: 150, height: 150, borderRadius: "50%" }} />
      </label>
    )}
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="profileImage">
            <img src={imagePreview} alt="Profile" style={{ width: 150, height: 150, borderRadius: "50%" }} />
          </label>

          <input 
            type="file" 
            id="profileImage" 
            accept="image/*" 
            {...register("img")} 
            style={{ display: "none" }} 
          />
          <p>Username:</p>
          <input type="text" placeholder="Username" {...register("username")} />
          {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

          <p>Password:</p>
          <input type="password" placeholder="New password" {...register("password")} />
          {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </>
      )}

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/home")}>
        Back to Home
      </button>

      <div style={{ marginTop: "50px" }}>
        {user._id && (
          <PostList key={user.imgUrl + user.username} 
          user={{ username: user.username, email: user.email, _id: user._id }} 
          showUserPostsOnly
          allowEdit={true} />
        )}
      </div>
    </div>
  );
  {user._id && <CommentsList user={{ _id: user._id || "" }} />}
};

export default Profile;
