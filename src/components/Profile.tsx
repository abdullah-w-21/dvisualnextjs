import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosResponse } from 'axios';

interface Site {
  site_id: string;
  site_name: string;
  site_location: string;
  // Add other properties if needed
}

const Profile = () => {
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [login, setLogin] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [error, setError] = useState('');
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const router = useRouter();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse: AxiosResponse<{ login: boolean; user?: {
          id: any;
          organisation_id: any; email: string; 
}[] }> = await axios.get('/api/login');
        setLogin(loginResponse.data.login);

        if (loginResponse.data.user) {
          setEmail(loginResponse.data.user[0].email);

          // Fetch organization name
          const organizationResponse: AxiosResponse<{ organizationname: string }> = await axios.get(`/api/organizationname/${loginResponse.data.user[0].id}`);
          setOrganizationName(organizationResponse.data.organizationname);

          // Fetch the list of sites for the logged-in user's organization
          const sitesResponse: AxiosResponse<{ sites: Site[] }> = await axios.get(`/api/sites/${loginResponse.data.user[0].organisation_id}`);
          setSites(sitesResponse.data.sites);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [router]);

  const handleAddSite = async () => {
    try {
      // Fetch the logged-in user's data
      const loginResponse: AxiosResponse<{ user?: { organisation_id: string; }[] }> = await axios.get('/api/login');
      if (!loginResponse.data.user) {
        router.push('/login');
        return;
      }

      const response: AxiosResponse<{ success: boolean; error?: string }> = await axios.post('/api/addsite', {
        organisation_id: loginResponse.data.user[0].organisation_id,
        site_name: siteName,
        site_location: siteLocation,
      }, { withCredentials: true });

      if (response.data.success) {
        setShowAddSiteForm(false);
        setSiteName('');
        setSiteLocation('');
        setError('');
        // Fetch the updated list of sites and update the state accordingly
        const updatedSitesResponse: AxiosResponse<{ sites: Site[] }> = await axios.get(`/api/sites/${loginResponse.data.user[0].organisation_id}`);
        setSites(updatedSitesResponse.data.sites);
      } else {
        setError(response.data.error || 'Internal Server Error');
      }
    } catch (error) {
      console.error('Error adding site:', error);
      setError('Internal Server Error');
    }
  };

  const handleSiteButtonClick = (siteId: string) => {
    router.push(`/visualize/${siteId}`);
  };

  return (
    <section className="bg-gray-900 text-white w-full h-90vh">
      <div className="container mx-auto">
        <div className="sitedabba">
          {sites.map((site) => (
            <div key={site.site_id} onClick={() => handleSiteButtonClick(site.site_id)} className="added-button">
              {site.site_name} - {site.site_location}
            </div>
          ))}
        </div>

        {showAddSiteForm ? (
          <div className="afterbutton">
            <div>
              <label className="sitename-label">Site Name:</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
            <div>
              <label className="sitelocation-label">Site Location:</label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
              />
              <button onClick={handleAddSite}>Add Site</button>
              <button onClick={() => setShowAddSiteForm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="mysitebutton" onClick={() => setShowAddSiteForm(true)}>Add Site</button>
        )}

        <div className="box">
          <p>Email: {login ? email : null}</p>
          <p>Organization Name: {organizationName}</p>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
};

export default Profile;
