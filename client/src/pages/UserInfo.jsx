/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  ConfirmationModal,
  UserPersonalInfo,
  UserPropertiesInfo,
} from "../components";

const UserInfo = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [propertiesShown, setPropertiesShown] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // ************** Fetch User Info **************** //
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/user-info/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to fetch user info.");
        return;
      }

      setUserData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // ************** Fetch User Properties ********* //
  const handleShowProperties = async () => {
    try {
      if (propertiesShown) {
        setPropertiesShown(false);
        setUserProperties([]);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user-properties/${
          userData._id
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      setUserProperties(data);
      setPropertiesShown(true);
    } catch (error) {
      setUserProperties([]);
      console.log(error.message);
    }
  };

  // ************** Delete User Property ********* //
  const handlePropertyDelete = async (propertyId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/delete-property/${propertyId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete property.");
        return;
      }

      setUserProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
      toast.success(data.message);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id, fetchUser]);

  const handleDeleteConfirmation = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPropertyId) {
      handlePropertyDelete(selectedPropertyId);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 max-w-4xl mx-auto">
      <UserPersonalInfo
        userData={userData}
        handleShowProperties={handleShowProperties}
        propertiesShown={propertiesShown}
      />
      {propertiesShown && (
        <UserPropertiesInfo
          userData={userData}
          userProperties={userProperties}
          isSmallScreen={isSmallScreen}
          handlePropertyDelete={handleDeleteConfirmation}
        />
      )}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Are you sure you want to delete this property?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default UserInfo;
