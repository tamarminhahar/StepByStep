[1mdiff --git a/Client/package-lock.json b/Client/package-lock.json[m
[1mindex 937007d..1dbb83d 100644[m
[1m--- a/Client/package-lock.json[m
[1m+++ b/Client/package-lock.json[m
[36m@@ -13,7 +13,6 @@[m
         "@fullcalendar/react": "^6.1.17",[m
         "@fullcalendar/timegrid": "^6.1.17",[m
         "@hookform/resolvers": "^5.1.1",[m
[31m-        "axios": "^1.10.0",[m
         "crypto-js": "^4.2.0",[m
         "js-cookie": "^3.0.5",[m
         "react": "^19.1.0",[m
[36m@@ -1587,23 +1586,6 @@[m
       "dev": true,[m
       "license": "Python-2.0"[m
     },[m
[31m-    "node_modules/asynckit": {[m
[31m-      "version": "0.4.0",[m
[31m-      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",[m
[31m-      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",[m
[31m-      "license": "MIT"[m
[31m-    },[m
[31m-    "node_modules/axios": {[m
[31m-      "version": "1.10.0",[m
[31m-      "resolved": "https://registry.npmjs.org/axios/-/axios-1.10.0.tgz",[m
[31m-      "integrity": "sha512-/1xYAC4MP/HEG+3duIhFr4ZQXR4sQXOIe+o6sdqzeykGLx6Upp/1p8MHqhINOvGeP7xyNHe7tsiJByc4SSVUxw==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "follow-redirects": "^1.15.6",[m
[31m-        "form-data": "^4.0.0",[m
[31m-        "proxy-from-env": "^1.1.0"[m
[31m-      }[m
[31m-    },[m
     "node_modules/balanced-match": {[m
       "version": "1.0.2",[m
       "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",[m
[36m@@ -1664,19 +1646,6 @@[m
         "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"[m
       }[m
     },[m
[31m-    "node_modules/call-bind-apply-helpers": {[m
[31m-      "version": "1.0.2",[m
[31m-      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",[m
[31m-      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "es-errors": "^1.3.0",[m
[31m-        "function-bind": "^1.1.2"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
     "node_modules/callsites": {[m
       "version": "3.1.0",[m
       "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",[m
[36m@@ -1754,18 +1723,6 @@[m
       "dev": true,[m
       "license": "MIT"[m
     },[m
[31m-    "node_modules/combined-stream": {[m
[31m-      "version": "1.0.8",[m
[31m-      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",[m
[31m-      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "delayed-stream": "~1.0.0"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.8"[m
[31m-      }[m
[31m-    },[m
     "node_modules/concat-map": {[m
       "version": "0.0.1",[m
       "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",[m
[36m@@ -1855,29 +1812,6 @@[m
       "dev": true,[m
       "license": "MIT"[m
     },[m
[31m-    "node_modules/delayed-stream": {[m
[31m-      "version": "1.0.0",[m
[31m-      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",[m
[31m-      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",[m
[31m-      "license": "MIT",[m
[31m-      "engines": {[m
[31m-        "node": ">=0.4.0"[m
[31m-      }[m
[31m-    },[m
[31m-    "node_modules/dunder-proto": {[m
[31m-      "version": "1.0.1",[m
[31m-      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",[m
[31m-      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "call-bind-apply-helpers": "^1.0.1",[m
[31m-        "es-errors": "^1.3.0",[m
[31m-        "gopd": "^1.2.0"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
     "node_modules/electron-to-chromium": {[m
       "version": "1.5.159",[m
       "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.159.tgz",[m
[36m@@ -1970,51 +1904,6 @@[m
         }[m
       }[m
     },[m
[31m-    "node_modules/es-define-property": {[m
[31m-      "version": "1.0.1",[m
[31m-      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",[m
[31m-      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",[m
[31m-      "license": "MIT",[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
[31m-    "node_modules/es-errors": {[m
[31m-      "version": "1.3.0",[m
[31m-      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",[m
[31m-      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",[m
[31m-      "license": "MIT",[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
[31m-    "node_modules/es-object-atoms": {[m
[31m-      "version": "1.1.1",[m
[31m-      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",[m
[31m-      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "es-errors": "^1.3.0"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
[31m-    "node_modules/es-set-tostringtag": {[m
[31m-      "version": "2.1.0",[m
[31m-      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",[m
[31m-      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "es-errors": "^1.3.0",[m
[31m-        "get-intrinsic": "^1.2.6",[m
[31m-        "has-tostringtag": "^1.0.2",[m
[31m-        "hasown": "^2.0.2"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": ">= 0.4"[m
[31m-      }[m
[31m-    },[m
     "node_modules/esbuild": {[m
       "version": "0.25.5",[m
       "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.5.tgz",[m
[36m@@ -2344,42 +2233,6 @@[m
       "dev": true,[m
       "license": "ISC"[m
     },[m
[31m-    "node_modules/follow-redirects": {[m
[31m-      "version": "1.15.9",[m
[31m-      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.15.9.tgz",[m
[31m-      "integrity": "sha512-gew4GsXizNgdoRyqmyfMHyAmXsZDk6mHkSxZFCzW9gwlbtOW44CDtYavM+y+72qD/Vq2l550kMF52DT8fOLJqQ==",[m
[31m-      "funding": [[m
[31m-        {[m
[31m-          "type": "individual",[m
[31m-          "url": "https://github.com/sponsors/RubenVerborgh"[m
[31m-        }[m
[31m-      ],[m
[31m-      "license": "MIT",[m
[31m-      "engines": {[m
[31m-        "node": ">=4.0"[m
[31m-      },[m
[31m-      "peerDependenciesMeta": {[m
[31m-        "debug": {[m
[31m-          "optional": true[m
[31m-        }[m
[31m-      }[m
[31m-    },[m
[31m-    "node_modules/form-data": {[m
[31m-      "version": "4.0.3",[m
[31m-      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.3.tgz",[m
[31m-      "integrity": "sha512-qsITQPfmvMOSAdeyZ+12I1c+CKSstAFAwu+97zrnWAbIr5u8wfsExUzCesVLC8NgHuRUqNN4Zy6UPWUTRGslcA==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "asynckit": "^0.4.0",[m
[31m-        "combined-stream": "^1.0.8",[m
[31m-        "es-set-tost