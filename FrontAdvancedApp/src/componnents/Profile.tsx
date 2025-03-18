import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService, { User } from "../services/user_service";
import avatar from "../assets/avatar.png"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import {userValidSchema, profileSchema} from "../services/validationSchema_service"
import { useForm } from "react-hook-form";

const Profile: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const user = location.state
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
          } = useForm<userValidSchema>({
            resolver: zodResolver(profileSchema),
          });


    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
        <h2>Profile</h2>
        <img
            src={user.imgUrl ? user.imgUrl : avatar}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "10px" }}/>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button
            style={{
            marginTop: "10px",
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            }}
            onClick={() => navigate("/home",{state:user})}
        >
            Back to Home
        </button>
        </div>
    );
};

export default Profile;


// // import { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import userService, { User } from "../services/user_service";
// // import avatar from "../assets/avatar.png";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { profileSchema } from "../services/validationSchema_service";
// // import { useForm } from "react-hook-form";

// // const Profile: React.FC = () => {
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [loading, setLoading] = useState(false);
// //     const user = location.state as User;

// //     const {
// //         register,
// //         handleSubmit,
// //         watch,
// //         setValue,
// //         formState: { errors },
// //     } = useForm<User>({
// //         resolver: zodResolver(profileSchema),
// //         defaultValues: {
// //             username: user.username,
// //             email: user.email,
// //             imgUrl: user.imgUrl,
// //         },
// //     });

// //     // Handle profile update
// //     const onSubmit = async (data: User) => {
// //         try {
// //             setLoading(true);
// //             const updatedUser = { ...user, ...data };
// //             await userService.updateProfile(updatedUser);
// //             setIsEditing(false);
// //             console.log("Profile updated:", updatedUser);
// //         } catch (error) {
// //             console.error("Error updating profile:", error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Handle profile picture upload
// //     const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const file = e.target.files?.[0];
// //         if (file) {
// //             const reader = new FileReader();
// //             reader.onloadend = async () => {
// //                 try {
// //                     const { request } = userService.uploadImage(file);  
// //                     const response = await request;  
// //                     setValue("imgUrl", response.data.imgUrl);  
// //                 } catch (error) {
// //                     console.error("Image upload failed:", error);
// //                 }
// //             };
// //             reader.readAsDataURL(file);
// //         }
// //     };
    
    

// //     return (
// //         <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
// //             <h2>Profile</h2>
// //             <img
// //                 src={watch("imgUrl") || avatar}
// //                 alt="Profile"
// //                 style={{
// //                     width: "150px",
// //                     height: "150px",
// //                     borderRadius: "50%",
// //                     marginBottom: "10px",
// //                 }}
// //             />
// //             {isEditing && (
// //                 <input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleImageUpload}
// //                     style={{ marginBottom: "10px" }}
// //                 />
// //             )}

// //             <form onSubmit={handleSubmit(onSubmit)}>
// //                 <div>
// //                     <label><strong>Username:</strong></label>
// //                     {isEditing ? (
// //                         <input
// //                             {...register("username")}
// //                             style={{ width: "100%", padding: "5px", margin: "5px 0" }}
// //                         />
// //                     ) : (
// //                         <p>{user.username}</p>
// //                     )}
// //                     {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
// //                 </div>

// //                 <div>
// //                     <label><strong>Email:</strong></label>
// //                     {isEditing ? (
// //                         <input
// //                             {...register("email")}
// //                             style={{ width: "100%", padding: "5px", margin: "5px 0" }}
// //                         />
// //                     ) : (
// //                         <p>{user.email}</p>
// //                     )}
// //                     {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
// //                 </div>

// //                 {!isEditing ? (
// //                     <button
// //                         type="button"
// //                         style={{
// //                             marginTop: "10px",
// //                             backgroundColor: "green",
// //                             color: "white",
// //                             padding: "10px",
// //                             border: "none",
// //                             cursor: "pointer",
// //                         }}
// //                         onClick={() => setIsEditing(true)}
// //                     >
// //                         Edit Profile
// //                     </button>
// //                 ) : (
// //                     <>
// //                         <button
// //                             type="submit"
// //                             style={{
// //                                 marginTop: "10px",
// //                                 backgroundColor: "blue",
// //                                 color: "white",
// //                                 padding: "10px",
// //                                 border: "none",
// //                                 cursor: "pointer",
// //                                 marginRight: "5px",
// //                             }}
// //                             disabled={loading}
// //                         >
// //                             {loading ? "Saving..." : "Save"}
// //                         </button>
// //                         <button
// //                             type="button"
// //                             style={{
// //                                 marginTop: "10px",
// //                                 backgroundColor: "gray",
// //                                 color: "white",
// //                                 padding: "10px",
// //                                 border: "none",
// //                                 cursor: "pointer",
// //                             }}
// //                             onClick={() => setIsEditing(false)}
// //                         >
// //                             Cancel
// //                         </button>
// //                     </>
// //                 )}
// //             </form>

// //             <button
// //                 style={{
// //                     marginTop: "10px",
// //                     backgroundColor: "blue",
// //                     color: "white",
// //                     padding: "10px",
// //                     border: "none",
// //                     cursor: "pointer",
// //                 }}
// //                 onClick={() => navigate("/home", { state: user })}
// //             >
// //                 Back to Home
// //             </button>
// //         </div>
// //     );
// // };

// // export default Profile;


// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import userService, { User } from "../services/user_service";
// import avatar from "../assets/avatar.png";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { profileSchema } from "../services/validationSchema_service";
// import { useForm } from "react-hook-form";

// const Profile: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [isEditing, setIsEditing] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const user = location.state;
//     const fileInputRef = useRef<HTMLInputElement>(null); 

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         formState: { errors },
//     } = useForm<User>({
//         resolver: zodResolver(profileSchema),
//         defaultValues: {
//             username: user.username,
//             email: user.email,
//             imgUrl: user.imgUrl,
//         },
//     });

//     const onSubmit = async (data: User) => {
//         try {
//             setLoading(true);
//             const updatedUser = { ...user, ...data };
//             await userService.updateProfile(updatedUser);
//             setIsEditing(false);
//             console.log("Profile updated:", updatedUser);
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = async () => {
//                 try {
//                     const { request } = userService.uploadImage(file); 
//                     const response = await request; 
//                     setValue("imgUrl", response.data.imgUrl); 
//                 } catch (error) {
//                     console.error("Image upload failed:", error);
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
//             <h2>Profile</h2>
//             <img
//                 src={watch("imgUrl") || avatar}
//                 alt="Profile"
//                 style={{
//                     width: "150px",
//                     height: "150px",
//                     borderRadius: "50%",
//                     marginBottom: "10px",
//                     cursor: "pointer", 
//                 }}
//                 onClick={() => fileInputRef.current?.click()} 
//             />

//             <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef} 
//                 style={{ display: "none" }} 
//                 onChange={handleImageUpload}
//             />

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div>
//                     <label><strong>Username:</strong></label>
//                     {isEditing ? (
//                         <input
//                             {...register("username")}
//                             style={{ width: "100%", padding: "5px", margin: "5px 0" }}
//                         />
//                     ) : (
//                         <p>{user.username}</p>
//                     )}
//                     {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
//                 </div>

//                 <div>
//                     <label><strong>Email:</strong></label>
//                     {isEditing ? (
//                         <input
//                             {...register("email")}
//                             style={{ width: "100%", padding: "5px", margin: "5px 0" }}
//                         />
//                     ) : (
//                         <p>{user.email}</p>
//                     )}
//                     {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
//                 </div>

//                 {!isEditing ? (
//                     <button
//                         type="button"
//                         style={{
//                             marginTop: "10px",
//                             backgroundColor: "green",
//                             color: "white",
//                             padding: "10px",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                         onClick={() => setIsEditing(true)}
//                     >
//                         Edit Profile
//                     </button>
//                 ) : (
//                     <>
//                         <button
//                             type="submit"
//                             style={{
//                                 marginTop: "10px",
//                                 backgroundColor: "blue",
//                                 color: "white",
//                                 padding: "10px",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 marginRight: "5px",
//                             }}
//                             disabled={loading}
//                         >
//                             {loading ? "Saving..." : "Save"}
//                         </button>
//                         <button
//                             type="button"
//                             style={{
//                                 marginTop: "10px",
//                                 backgroundColor: "gray",
//                                 color: "white",
//                                 padding: "10px",
//                                 border: "none",
//                                 cursor: "pointer",
//                             }}
//                             onClick={() => setIsEditing(false)}
//                         >
//                             Cancel
//                         </button>
//                     </>
//                 )}
//             </form>

//             <button
//                 style={{
//                     marginTop: "10px",
//                     backgroundColor: "blue",
//                     color: "white",
//                     padding: "10px",
//                     border: "none",
//                     cursor: "pointer",
//                 }}
//                 onClick={() => navigate("/home", { state: user })}
//             >
//                 Back to Home
//             </button>
//         </div>
//     );
// };

// export default Profile;
