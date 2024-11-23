import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileForm } from "../components";

const UpdateUser = () => {
  const [initialFormData, setinitialFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    localno: "",
    whatsappno: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/user-info/${id}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message);
          return;
        }

        setinitialFormData(data);
      } catch (error) {
        toast.error("Something went wrong, please try again later!");
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-user/${id}`,

        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Profile updated successfully.");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        <h1>Update Profile of {initialFormData?.username || "User"}</h1>
      </h1>
      <ProfileForm
        isAdmin={true}
        updateUserAsAdmin={true}
        onSubmit={handleSubmit}
        initialFormData={initialFormData}
      />
    </div>
  );
};

export default UpdateUser;
