export const validateForm = (formData, errors) => {
  let newErrors = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";

  if (!formData.email.trim()) newErrors.email = "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email))
    newErrors.email = "Invalid email";

  if (formData.phone.length !== 10)
    newErrors.phone = "Phone must be 10 digits";

  if (!formData.gender)
    newErrors.gender = "Select gender";

  if (errors.profile) newErrors.profile = errors.profile;

  return newErrors;
};