import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, userValidSchema } from "../services/validationSchema_service";
import userService, { User } from "../services/user_service";
import avatar from "../assets/avatar.png";

const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(location.state);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(user.imgUrl || avatar);
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

  useEffect(() => {
    if (img && img.length > 0) {
      setImagePreview(URL.createObjectURL(img[0]));
    }
  }, [img]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size <= 5 * 1024 * 1024) {
      setValue("img", e.target.files);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

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
        imgUrl,
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
    <div style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <h2>Profile</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <label htmlFor="profileImage">
        <img src={imagePreview} alt="Profile" style={{ width: 150, height: 150, borderRadius: "50%" }} />
      </label>
      {isEditing && (
        <input type="file" id="profileImage" accept="image/*" {...register("img")} onChange={handleImageChange} />
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Username" {...register("username")} />
          {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

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
      <button onClick={() => navigate("/home", { state: user })}>Back to Home</button>
    </div>
  );
};

export default Profile;
