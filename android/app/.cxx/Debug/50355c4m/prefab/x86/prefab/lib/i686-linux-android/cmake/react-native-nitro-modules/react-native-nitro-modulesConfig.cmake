if(NOT TARGET react-native-nitro-modules::NitroModules)
add_library(react-native-nitro-modules::NitroModules SHARED IMPORTED)
set_target_properties(react-native-nitro-modules::NitroModules PROPERTIES
    IMPORTED_LOCATION "C:/Users/Rehmati/Desktop/MyNewProject/node_modules/react-native-nitro-modules/android/build/intermediates/cxx/Debug/6d2d4b6p/obj/x86/libNitroModules.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Rehmati/Desktop/MyNewProject/node_modules/react-native-nitro-modules/android/build/headers/nitromodules"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

