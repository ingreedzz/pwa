import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this._cameraStream = null;
  }

  async init() {
    this._initializeMap();
    this.view.bindCameraOptionChange(this._startCamera.bind(this), this._stopCamera.bind(this));
    this.view.bindCapturePhoto(this._handlePhotoCaptured.bind(this));
    this.view.bindFormSubmit(this._handleFormSubmit.bind(this));
  }

  _initializeMap() {
    const mapElement = this.view.getMapElement();
    if (!mapElement) {
      this.view.showMessage('Map element not found in the DOM.');
      return;
    }

    this._map = L.map(mapElement).setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this._map);

    this._map.on('click', (event) => {
      this._selectedLat = event.latlng.lat;
      this._selectedLon = event.latlng.lng;

      this.view.clearMarkers(this._map);
      this.view.addMarker(this._map, this._selectedLat, this._selectedLon);
    });
  }

  async _startCamera() {
    try {
      this._cameraStream = await this.view.startCamera();
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  }

  _stopCamera() {
    this.view.stopCamera();
    this._cameraStream = null;
  }

  cleanup() {
    this._stopCamera();
  }

  _handlePhotoCaptured(canvas) {
    this._capturedPhotoCanvas = canvas;
    this.view.displayCapturedPhoto(canvas.toDataURL('image/png'));
  }

  async _handleFormSubmit(event) {
    event.preventDefault();

    const { description, photoInput, cameraOption } = this.view.getFormElements();
    const isCameraPhoto = cameraOption && cameraOption.checked;
    const photo = isCameraPhoto ? this._capturedPhotoCanvas : photoInput.files[0];

    if (!description.value.trim() || (!photo && !isCameraPhoto) || !this._selectedLat || !this._selectedLon) {
      this.view.showMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description.value.trim());
    formData.append('lat', this._selectedLat);
    formData.append('lon', this._selectedLon);

    if (isCameraPhoto) {
      if (!this._capturedPhotoCanvas) {
        this.view.showMessage('Please capture a photo before submitting.');
        return;
      }

      this._capturedPhotoCanvas.toBlob((blob) => {
        formData.append('photo', blob, 'captured-photo.png');
        this._submitStory(formData);
      });
    } else {
      formData.append('photo', photo);
      this._submitStory(formData);
    }
  }

  async _submitStory(formData) {
    try {
      await this.model.addStory(formData);
      this.view.showMessage('Story added successfully!');
      this.view.resetForm();
    } catch (error) {
      this.view.showMessage(`Failed to add story: ${error.message}`);
    }
  }
}