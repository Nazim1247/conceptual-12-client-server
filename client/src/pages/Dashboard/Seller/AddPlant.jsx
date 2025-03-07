import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../layouts/utils';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AddPlant = () => {
  const { user } = useAuth();
  const [uploadButtonText, setUploadButtonText] = useState({name:'upload image'});
  const [loading,setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageUrl = await imageUpload(image);

    // user info
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }

    // create plant data 
    const plantData = {
      name,
      category,
      description,
      price, quantity,
      image: imageUrl,
      seller
    }
    console.table(plantData)
    // save plant in db
    try{
      // post req 
      await axiosSecure.post('/plants', plantData)
      toast.success('Data Added Successfully !')
    }catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit} uploadButtonText={uploadButtonText}
        setUploadButtonText={setUploadButtonText}
        loading={loading} />
    </div>
  )
}

export default AddPlant
