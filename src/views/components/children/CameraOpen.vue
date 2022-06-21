<template>
  <div class="camera mt-10 lg:mt-2">
    <div class="wrapper flex">
      <div class="btn-group flex flex-col pr-6 text-sm">
        <button type="button"
        class="px-2 py-1 bg-orange-500 focus:bg-orange-600 text-white rounded-2xl my-3"
        @click="toggleCamera"
      >
        <span v-if="!showCamera">Mở Camera</span>
        <span v-else>Đóng Camera</span>
      </button>
          <button type="button" v-if="showCamera" class="px-2 oy-1 focus:bg-orange-600 bg-orange-500 text-white rounded-2xl my-3" @click="takePhoto">
        <span>Chụp</span>
      </button>
      <button type="button" class="camera-download px-2 oy-1 focus:bg-orange-600 bg-orange-500 text-white rounded-2xl my-3" v-if="showCamera && isPhotoTaken">
        <a
          id="downloadPhoto"
          @click="downloadImage"
        >
          Chọn ảnh
        </a>
      </button>
      </div>
      <div class="video-container" v-if="showCamera">
        <video
          v-show="!isPhotoTaken"
          class="camera-video"
          ref="camera"
          width="200"
          height="150"
          autoplay
          playsinline
        ></video>
        <canvas
          id="photoTaken"
          v-show="isPhotoTaken"
          class="canvas-photo"
          ref="canvas"
          width="200"
          height="150"
        ></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import databaseRecord from '@/libs/firebaseAdd'
export default {
  setup(props, context) {
    const showCamera = ref(false)
    const isLoading = ref(false)
    const camera = ref(null)
    const isPhotoTaken = ref(false)
    const canvas = ref(null)
    function createCameraElement() {
      isLoading.value = true
      const constraints = (window.constraints = {
        audio: false,
        video: true,
      })
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          isLoading.value = false
          camera.value.srcObject = stream
        })
        .catch((error) => {
          isLoading.value = false
          alert("May the browser didn't support or there is some errors.")
        })
    }

    function stopCameraStream() {
      let tracks = camera.value.srcObject.getTracks()
      tracks.forEach((track) => {
        track.stop();
      })
    }

    function takePhoto() {
      if (!isPhotoTaken.value) {
        const FLASH_TIME = 50
        setTimeout(() => {}, FLASH_TIME)
      }
      isPhotoTaken.value = !isPhotoTaken.value
      const contextC = canvas.value.getContext("2d")
      contextC.drawImage(camera.value, 0, 0, 200, 150)
    }

    function downloadImage() {
         canvas.value.toBlob(blob => {
            const file = new File([blob], "snap_camera_shoot.jpeg", { type: "image/jpeg" })
            context.emit('snap-shot-image', file)
        })
    }
    

    function toggleCamera() {
      if (showCamera.value) {
        showCamera.value = false
        isPhotoTaken.value = false
        stopCameraStream();
      } else {
        showCamera.value = true
        createCameraElement()
      }
    }
    return {
      createCameraElement,
      toggleCamera,
      camera,
      takePhoto,
      canvas,
      isPhotoTaken,
      showCamera,
      downloadImage
    };
  },
}
</script>
<style>
</style>
